import api from './applications';

export const getColdEmails = async () => {
  const { data } = await api.get('/cold-emails/');
  return data;
};

export const createColdEmail = async (emailData) => {
  const { data } = await api.post('/cold-emails/', emailData);
  return data;
};

export const updateColdEmail = async (id, updateData) => {
  const { data } = await api.patch(`/cold-emails/${id}`, updateData);
  return data;
};

export const deleteColdEmail = async (id) => {
  await api.delete(`/cold-emails/${id}`);
};
