export const getPhongHoc = () => {
  const dataLocal: PhongHoc.IRecord[] = JSON.parse(localStorage.getItem('phonghoc') || '[]');
  return dataLocal;
};

export const createPhongHoc = (record: Omit<PhongHoc.IRecord, '_id' | 'createdAt' | 'updatedAt'>) => {
  const dataLocal: PhongHoc.IRecord[] = JSON.parse(localStorage.getItem('phonghoc') || '[]');
  const newRecord: PhongHoc.IRecord = {
    ...record,
    _id: `ph_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const newData = [newRecord, ...dataLocal];
  localStorage.setItem('phonghoc', JSON.stringify(newData));
  return newData;
};

export const updatePhongHoc = (id: string, record: Partial<PhongHoc.IRecord>) => {
  const dataLocal: PhongHoc.IRecord[] = JSON.parse(localStorage.getItem('phonghoc') || '[]');
  const index = dataLocal.findIndex(item => item._id === id);
  
  if (index !== -1) {
    const updatedRecord = {
      ...dataLocal[index],
      ...record,
      updatedAt: new Date().toISOString(),
    };
    
    dataLocal[index] = updatedRecord;
    localStorage.setItem('phonghoc', JSON.stringify(dataLocal));
    return dataLocal;
  }
  return dataLocal;
};

export const deletePhongHoc = (id: string) => {
  const dataLocal: PhongHoc.IRecord[] = JSON.parse(localStorage.getItem('phonghoc') || '[]');
  const newData = dataLocal.filter(item => item._id !== id);
  localStorage.setItem('phonghoc', JSON.stringify(newData));
  return newData;
}; 