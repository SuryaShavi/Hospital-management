import request from 'supertest';

describe('Backend API integration tests', () => {
  const apiBase = process.env.API_BASE_URL || 'http://localhost:8080/api';
  let authToken: string | undefined;

  beforeAll(async () => {
    // this assumes a test user exists; adjust credentials or create a test user via the API
    const res = await request(apiBase)
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'password' });
    if (res.body && res.body.token) {
      authToken = res.body.token;
    }
  });

  test('health check or root returns 200', async () => {
    const res = await request(apiBase).get('/');
    expect([200, 404]).toContain(res.status); // backend may not implement a root route
  });

  describe('Patient endpoints', () => {
    let createdPatientId: number;

    it('GET /patients should return an array', async () => {
      const res = await request(apiBase).get('/patients').set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('can create, update, delete a patient', async () => {
      const createRes = await request(apiBase)
        .post('/patients')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test Patient', age: 30, gender: 'M', contact: '12345', status: 'ACTIVE' });
      expect(createRes.status).toBe(201);
      createdPatientId = createRes.body.id;
      expect(createdPatientId).toBeDefined();

      const updateRes = await request(apiBase)
        .put(`/patients/${createdPatientId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Name', age: 31, gender: 'M', contact: '12345', status: 'ACTIVE' });
      expect(updateRes.status).toBe(200);

      const deleteRes = await request(apiBase)
        .delete(`/patients/${createdPatientId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect([200, 204]).toContain(deleteRes.status);
    });
  });

  // additional CRUD tests for doctors, appointments, billing, etc. can be added following the same pattern

});
