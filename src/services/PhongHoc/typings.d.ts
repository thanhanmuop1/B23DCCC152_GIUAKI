declare module PhongHoc {
  export type LoaiPhong = 'Lý thuyết' | 'Thực hành' | 'Hội trường';
  
  export interface IRecord {
    _id: string;
    maPhong: string;
    tenPhong: string;
    soChoNgoi: number;
    loaiPhong: LoaiPhong;
    nguoiPhuTrach: string;
    createdAt: string;
    updatedAt: string;
  }
} 