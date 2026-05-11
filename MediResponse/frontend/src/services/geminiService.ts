import { GoogleGenAI, Type } from '@google/genai';
import { PatientData, TriageResult, Severity } from '../types';

const getAiClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('Gemini API Key missing. Using fallback triage logic.');
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const triagePatient = async (data: PatientData): Promise<TriageResult> => {
  const ai = getAiClient();

  if (!ai) {
    return {
      severity: Severity.MODERATE,
      summary: 'Automated triage offline — API key not configured. Follow standard emergency protocols.',
      recommended_specialists: ['ER Triage Physician'],
      equipment_needed: ['Standard Emergency Response Kit'],
    };
  }

  try {
    const prompt = `
      You are an emergency medical triage AI. Analyze the following patient data reported by paramedics in the field.

      Patient Information:
      - Name: ${data.name}
      - Age: ${data.age}
      - Gender: ${data.gender}
      - Blood Group: ${data.bloodGroup}
      - Reported Symptoms: ${data.symptoms}
      - Initial Vitals: ${data.vitals}

      Based on this information, provide a concise structured triage assessment:
      1. Severity level: CRITICAL (life-threatening), MODERATE (urgent but stable), or STABLE (non-urgent)
      2. A brief 1-2 sentence clinical summary of the patient's likely condition
      3. List of recommended specialists the hospital should have ready
      4. List of key equipment/resources the hospital should prepare

      Be concise and clinically accurate. This data will be forwarded to the receiving hospital.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            severity: {
              type: Type.STRING,
              enum: [Severity.CRITICAL, Severity.MODERATE, Severity.STABLE],
            },
            summary: { type: Type.STRING },
            recommended_specialists: { type: Type.ARRAY, items: { type: Type.STRING } },
            equipment_needed:        { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['severity', 'summary', 'recommended_specialists', 'equipment_needed'],
        },
      },
    });

    const text = response.text || '{}';
    return JSON.parse(text) as TriageResult;
  } catch (error) {
    console.error('Triage error:', error);
    return {
      severity: Severity.MODERATE,
      summary: 'Automated analysis failed. Proceed with standard emergency protocols and manual assessment.',
      recommended_specialists: ['General ER Physician'],
      equipment_needed: ['Standard ER Kit'],
    };
  }
};
