package com.techtest.employee_api.service;

import com.techtest.employee_api.dto.EmployeeDto;
import com.techtest.employee_api.entity.Employee;
import com.techtest.employee_api.exception.ResourceNotFoundException;
import com.techtest.employee_api.mapper.EmployeeMapper;
import com.techtest.employee_api.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public List<EmployeeDto> getAllEmployees() {
        List<Employee> employees = employeeRepository.findAll();
        return employees.stream().map(EmployeeMapper::mapToDto).collect(Collectors.toList());
    }

    @Override
    public EmployeeDto createEmployee(EmployeeDto employeeDto) {
        Employee employee = EmployeeMapper.mapToEntity(employeeDto);
        Employee savedEmployee = employeeRepository.save(employee);
        return EmployeeMapper.mapToDto(savedEmployee);
    }

    @Override
    public EmployeeDto getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Karyawan dengan ID: " + id + " tidak ditemukan!"));
        return EmployeeMapper.mapToDto(employee);
    }

    @Override
    public EmployeeDto updateEmployee(Long id, EmployeeDto employeeDto) {
        Employee employee = employeeRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Karyawan dengan ID: " + id + " tidak ditemukan!"));

        employee.setName(employeeDto.getName());
        employee.setGender(employeeDto.getGender());
        employee.setDateOfBirth(employeeDto.getDateOfBirth());
        employee.setAddress(employeeDto.getAddress());
        employee.setNationality(employeeDto.getNationality());

        Employee updatedEmployee = employeeRepository.save(employee);
        return EmployeeMapper.mapToDto(updatedEmployee);
    }

    @Override
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Karyawan dengan ID: " + id + " tidak ditemukan!"));
        employeeRepository.delete(employee);
    }
}