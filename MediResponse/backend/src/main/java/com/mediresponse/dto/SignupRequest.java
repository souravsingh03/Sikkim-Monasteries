package com.mediresponse.dto;
public class SignupRequest {
    private String employeeId, name, password, role, department;
    public String getEmployeeId(){return employeeId;} public void setEmployeeId(String e){this.employeeId=e;}
    public String getName(){return name;} public void setName(String n){this.name=n;}
    public String getPassword(){return password;} public void setPassword(String p){this.password=p;}
    public String getRole(){return role;} public void setRole(String r){this.role=r;}
    public String getDepartment(){return department;} public void setDepartment(String d){this.department=d;}
}