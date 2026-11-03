
import { TestBed, ComponentFixture } from '@angular/core/testing';

import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';

import { EmployeeForm } from './employee-form';
import { Employee } from '../../models/Employee';

describe('EmployeeForm', () => {

  let fixture: ComponentFixture<EmployeeForm>;
  let component: EmployeeForm;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [EmployeeForm]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeForm);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should populate form when employee input changes', async () => {

    const employee: Employee = {
      emp_Id: 5,
      name: 'Jash Patel',
      email: 'jash.bhandari@example.com',
      department: 'IT',
      salary: 85000,
      createdAt: '2026-10-01T10:00:00Z',
      updatedAt: '2026-10-01T10:00:00Z'
    };

    // Simulate parent passing the selected employee.
    fixture.componentRef.setInput('employee', employee);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.employeeForm.getRawValue()).toEqual({
      name: 'Jash Patel',
      email: 'jash.bhandari@example.com',
      department: 'IT',
      salary: 85000
    });
  });

  it('should emit trimmed valid employee data', () => {

    const emitSpy = vi.spyOn(
      component.saveRequested,
      'emit'
    );

    component.employeeForm.setValue({
      name: '  Jash Patel  ',
      email: '  jash.bhandari@example.com  ',
      department: '  IT  ',
      salary: 75000.50
    });

    component.submitForm();

    expect(emitSpy).toHaveBeenCalledWith({
      name: 'Jash Patel',
      email: 'jash.bhandari@example.com',
      department: 'IT',
      salary: 75000.50
    });
  });

  it('should reject invalid salary precision', () => {

    const emitSpy = vi.spyOn(
      component.saveRequested,
      'emit'
    );

    component.employeeForm.setValue({
      name: 'Jash Patel',
      email: 'jash.bhandari@example.com',
      department: 'IT',
      salary: 75000.567
    });

    component.submitForm();

    expect(component.employeeForm.invalid).toBe(true);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit cancel event', () => {

    const emitSpy = vi.spyOn(
      component.cancelRequested,
      'emit'
    );

    component.cancel();

    expect(emitSpy).toHaveBeenCalledOnce();
  });
});
