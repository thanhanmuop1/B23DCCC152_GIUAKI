import { useState, useCallback } from 'react';
import { Modal } from 'antd';
import { getPhongHoc, createPhongHoc, updatePhongHoc, deletePhongHoc } from '@/services/PhongHoc';

const { confirm } = Modal;

export default () => {
  const [data, setData] = useState<PhongHoc.IRecord[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [row, setRow] = useState<PhongHoc.IRecord>();
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [filters, setFilters] = useState<any[]>([]);
  
  // State cho tìm kiếm
  const [searchValue, setSearchValue] = useState<string>('');
  const [filteredData, setFilteredData] = useState<PhongHoc.IRecord[]>([]);

  const getPhongHocData = async () => {
    setLoading(true);
    try {
      const dataLocal = getPhongHoc();
      setData(dataLocal);
      setTotal(dataLocal.length);
      applySearch(dataLocal, searchValue); // Áp dụng tìm kiếm lên dữ liệu mới
      return dataLocal;
    } finally {
      setLoading(false);
    }
  };

  // Hàm tìm kiếm
  const applySearch = useCallback((dataToFilter: PhongHoc.IRecord[], value: string) => {
    if (!value.trim()) {
      setFilteredData(dataToFilter);
      return dataToFilter;
    }
    
    const lowercaseSearch = value.toLowerCase();
    const filtered = dataToFilter.filter(item => 
      item.maPhong.toLowerCase().includes(lowercaseSearch) || 
      item.tenPhong.toLowerCase().includes(lowercaseSearch)
    );
    
    setFilteredData(filtered);
    return filtered;
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
    applySearch(data, value);
  }, [data, applySearch]);

  // Xử lý xóa phòng học
  const handleDeletePhongHoc = useCallback((id: string) => {
    return new Promise<void>((resolve, reject) => {
      // Tìm record từ id
      const record = data.find(item => item._id === id);
      
      if (!record) {
        reject(new Error('Không tìm thấy phòng học'));
        return;
      }
      
      // Kiểm tra điều kiện xóa - chỉ được xóa phòng dưới 30 chỗ ngồi
      if (record.soChoNgoi >= 30) {
        Modal.error({
          title: 'Không thể xóa phòng học',
          content: 'Chỉ được phép xóa phòng học có dưới 30 chỗ ngồi',
          okText: 'Đóng',
        });
        reject(new Error('Không thể xóa phòng học có từ 30 chỗ ngồi trở lên'));
        return;
      }

      // Hiển thị cảnh báo trước khi xóa
      confirm({
        title: 'Xác nhận xóa phòng học',
        content: `Bạn có chắc chắn muốn xóa phòng học "${record.tenPhong}" (Mã: ${record.maPhong})? Hành động này không thể hoàn tác.`,
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        onOk: async () => {
          try {
            await deletePhongHoc(id);
            await getPhongHocData();
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        onCancel: () => {
          reject(new Error('Người dùng hủy xóa'));
        }
      });
    });
  }, [data]);

  const createPhongHocModel = async (record: Omit<PhongHoc.IRecord, '_id' | 'createdAt' | 'updatedAt'>) => {
    createPhongHoc(record);
    await getPhongHocData();
  };

  const updatePhongHocModel = async (id: string, record: Partial<PhongHoc.IRecord>) => {
    updatePhongHoc(id, record);
    await getPhongHocData();
  };
  
  // Form validation
  const validateMaPhong = useCallback((value: string, id?: string) => {
    if (!value) return Promise.reject(new Error('Vui lòng nhập mã phòng'));
    
    // Kiểm tra trùng mã phòng
    const existingRoom = data.find(
      (item) => item.maPhong === value && (id === undefined || item._id !== id)
    );
    
    if (existingRoom) {
      return Promise.reject(new Error('Mã phòng đã tồn tại'));
    }
    
    return Promise.resolve();
  }, [data]);

  const validateTenPhong = useCallback((value: string, id?: string) => {
    if (!value) return Promise.reject(new Error('Vui lòng nhập tên phòng'));
    
    // Kiểm tra trùng tên phòng
    const existingRoom = data.find(
      (item) => item.tenPhong === value && (id === undefined || item._id !== id)
    );
    
    if (existingRoom) {
      return Promise.reject(new Error('Tên phòng đã tồn tại'));
    }
    
    return Promise.resolve();
  }, [data]);

  return {
    data,
    visible,
    setVisible,
    row,
    setRow,
    isEdit, 
    setIsEdit,
    loading,
    page,
    setPage,
    limit,
    setLimit,
    total,
    filters,
    setFilters,
    getPhongHocData,
    createPhongHoc: createPhongHocModel,
    updatePhongHoc: updatePhongHocModel,
    deletePhongHoc: handleDeletePhongHoc,
    // Tìm kiếm
    searchValue,
    setSearchValue,
    filteredData,
    handleSearch,
    // Validation
    validateMaPhong,
    validateTenPhong
  };
}; 