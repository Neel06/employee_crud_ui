import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Employee } from '../models/Employee';
import { EmployeeService } from './employee';
import { PagedResult, EmployeeQuery } from '../models/employee-pagination';
import { environment } from '../../environments/environment';

describe('EmployeeService', () => {

  let service: EmployeeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EmployeeService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Ensure no HTTP requests were left outstanding.
    httpMock.verify();
  });

  it('should send correct pagination query parameters', () => {

    const query: EmployeeQuery = {
      pageNumber: 2,
      pageSize: 10,
      search: 'pagination',
      sortBy: 'name',
      sortDirection: 'asc'
    };

    const response: PagedResult<Employee> = {
      items: [],
      totalCount: 0,
      pageNumber: 2,
      pageSize: 10,
      totalPages: 0
    };

    let actual: PagedResult<Employee> | undefined;

    // Act
    service.getPagedEmployees(query).subscribe(data => {
      actual = data;
    });

    // Assert outgoing request
    const request = httpMock.expectOne(
      `${environment.apiUrl}/paged?pageNumber=2&pageSize=10&search=pagination&sortBy=name&sortDirection=asc`
    );

    expect(request.request.method).toBe('GET');

    expect(
      request.request.params.get('pageNumber')
    ).toBe('2');

    expect(
      request.request.params.get('search')
    ).toBe('pagination');

    // Simulate a response from the backend.
    request.flush(response);

    expect(actual).toEqual(response);
  });

  it('should send DELETE with the employee ID', () => {

    let completed = false;

    service.deleteEmployee(6).subscribe(() => {
      completed = true;
    });

    const request = httpMock.expectOne(
      `${environment.apiUrl}/6`
    );

    expect(request.request.method).toBe('DELETE');

    request.flush(null, {
      status: 204,
      statusText: 'No Content'
    });

    expect(completed).toBe(true);
  });


  it('should propagate HTTP 409 errors', () => {

    let errorStatus: number | undefined;

    service.createEmployee({
      name: 'Rahul Sharma',
      email: 'duplicate@example.com',
      department: 'IT',
      salary: 75000
    }).subscribe({
      error: err => {
        errorStatus = err.status;
      }
    });

    const request = httpMock.expectOne(
      environment.apiUrl
    );

    expect(request.request.method).toBe('POST');

    request.flush(
      { message: 'Email already Exists!' },
      {
        status: 409,
        statusText: 'Conflict'
      }
    );

    expect(errorStatus).toBe(409);
  });


});
