package com.techtest.employee_api.mapper;

import com.techtest.employee_api.dto.EmployeeDto;
import com.techtest.employee_api.entity.Employee;

public class EmployeeMapper {
    public static EmployeeDto mapToDto(Employee employee) {
        EmployeeDto dto = new EmployeeDto();
        dto.setId(employee.getId());
        dto.setName(employee.getName());
        dto.setGender(employee.getGender());
        dto.setDateOfBirth(employee.getDateOfBirth());
        dto.setAddress(employee.getAddress());
        dto.setNationality(employee.getNationality());
        
        return dto;
    }

    public static Employee mapToEntity(EmployeeDto dto) {
        Employee employee = new Employee();
        employee.setId(dto.getId());
        employee.setName(dto.getName());
        employee.setGender(dto.getGender());
        employee.setDateOfBirth(dto.getDateOfBirth());
        employee.setAddress(dto.getAddress());
        employee.setNationality(dto.getNationality());
        
        return employee;
    }
}
