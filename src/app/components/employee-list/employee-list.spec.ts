
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';

import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';

import { EmployeeList } from './employee-list';
import { EmployeeService } from '../../services/employee';
import { Employee } from '../../models/Employee';
import { PagedResult } from '../../models/employee-pagination';

describe('EmployeeList', () => {

  let fixture: ComponentFixture<EmployeeList>;
  let component: EmployeeList;

  const employees: Employee[] = [
    {
      emp_Id: 1,
      name: 'Jash Patel',
      email: 'jash.bhandari@example.com',
      department: 'IT',
      salary: 75000,
      createdAt: '2026-10-01T10:00:00Z',
      updatedAt: '2026-10-01T10:00:00Z'
    }
  ];

  const page: PagedResult<Employee> = {
    items: employees,
    totalCount: 1,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1
  };

  const apiMock = {
    getPagedEmployees: vi.fn(),
    createEmployee: vi.fn(),
    updateEmployee: vi.fn(),
    deleteEmployee: vi.fn()
  };

  beforeEach(async () => {

    vi.clearAllMocks();

    apiMock.getPagedEmployees.mockReturnValue(of(page));
    apiMock.createEmployee.mockReturnValue(of(employees[0]));
    apiMock.updateEmployee.mockReturnValue(of(undefined));
    apiMock.deleteEmployee.mockReturnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [EmployeeList],
      providers: [
        {
          provide: EmployeeService,
          useValue: apiMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeList);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should display employees returned by the service', () => {

    expect(component.employees().length).toBe(1);
    expect(component.employees()[0].name).toBe(
      'Jash Patel'
    );

    expect(
      fixture.nativeElement.textContent
    ).toContain('Jash Patel');
  });

  it('should request the selected sorting field', () => {

    component.changeSort('salary');

    expect(apiMock.getPagedEmployees)
      .toHaveBeenLastCalledWith(
        expect.objectContaining({
          sortBy: 'salary',
          pageNumber: 1
        })
      );
  });

  it('should call update API in Edit mode', () => {

    component.startEdit(employees[0]);

    component.saveEmployee({
      name: 'Jash Patel',
      email: 'jash.bhandari@example.com',
      department: 'Engineering',
      salary: 90000
    });

    expect(apiMock.updateEmployee)
      .toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          department: 'Engineering',
          salary: 90000
        })
      );
  });
});
