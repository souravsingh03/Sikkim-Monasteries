package com.medilink.dto;
public class AuthResponse {
    private boolean success; private String message, token, role, name, employeeId;
    public AuthResponse(boolean success, String message){this.success=success;this.message=message;}
    public AuthResponse(boolean success, String message, String token, String role, String name, String employeeId){
        this.success=success;this.message=message;this.token=token;this.role=role;this.name=name;this.employeeId=employeeId;
    }
    public boolean isSuccess(){return success;} public void setSuccess(boolean s){this.success=s;}
    public String getMessage(){return message;} public void setMessage(String m){this.message=m;}
    public String getToken(){return token;} public void setToken(String t){this.token=t;}
    public String getRole(){return role;} public void setRole(String r){this.role=r;}
    public String getName(){return name;} public void setName(String n){this.name=n;}
    public String getEmployeeId(){return employeeId;} public void setEmployeeId(String e){this.employeeId=e;}
}