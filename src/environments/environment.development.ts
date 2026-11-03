export const environment = {
    production: false,
    apiUrl: 'https://localhost:7141/api/Employees',
    authMeUrl: 'https://localhost:7141/api/auth/me',

    auth: {
        authority: 'http://localhost:8080/realms/employee-crud',
        clientId: 'employee-spa'
    }
};
