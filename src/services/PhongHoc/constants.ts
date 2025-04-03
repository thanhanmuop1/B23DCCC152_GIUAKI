// Enum loại phòng
export enum LoaiPhong {
  LY_THUYET = 'Lý thuyết',
  THUC_HANH = 'Thực hành',
  HOI_TRUONG = 'Hội trường',
}

// Danh sách người phụ trách
export const DANH_SACH_NGUOI_PHU_TRACH = [
  { id: '1', ten: 'Nguyễn Văn A' },
  { id: '2', ten: 'Trần Thị B' },
  { id: '3', ten: 'Lê Văn C' },
  { id: '4', ten: 'Phạm Thị D' },
  { id: '5', ten: 'Hoàng Văn E' },
];

// Filter options sẵn cho Table AntDesign
export const LOAI_PHONG_FILTERS = Object.values(LoaiPhong).map(loai => ({
  text: loai,
  value: loai,
}));

export const NGUOI_PHU_TRACH_FILTERS = DANH_SACH_NGUOI_PHU_TRACH.map(nguoi => ({
  text: nguoi.ten,
  value: nguoi.ten,
})); 