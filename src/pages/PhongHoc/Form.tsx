import { Form, Input, InputNumber, Modal, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { DANH_SACH_NGUOI_PHU_TRACH, LoaiPhong } from '@/services/PhongHoc/constants';

const { Option } = Select;

interface FormPhongHocProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  isEdit: boolean;
}

const FormPhongHoc: React.FC<FormPhongHocProps> = ({ visible, setVisible, isEdit }) => {
  const [form] = Form.useForm();
  const { row, createPhongHoc, updatePhongHoc, validateMaPhong, validateTenPhong } = useModel('phonghoc');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (visible && isEdit && row) {
      form.setFieldsValue({
        maPhong: row.maPhong,
        tenPhong: row.tenPhong,
        soChoNgoi: row.soChoNgoi,
        loaiPhong: row.loaiPhong,
        nguoiPhuTrach: row.nguoiPhuTrach,
      });
    } else {
      form.resetFields();
    }
  }, [visible, isEdit, row]);

  const validateMaPhongField = (_: any, value: string) => {
    return validateMaPhong(value, isEdit ? row?._id : undefined);
  };

  const validateTenPhongField = (_: any, value: string) => {
    return validateTenPhong(value, isEdit ? row?._id : undefined);
  };

  const handleSubmit = async (values: any) => {
    try {
      setSubmitLoading(true);
      if (isEdit && row) {
        await updatePhongHoc(row._id, values);
        message.success('Cập nhật phòng học thành công');
      } else {
        await createPhongHoc(values);
        message.success('Thêm phòng học thành công');
      }
      setVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Modal
      title={isEdit ? 'Chỉnh sửa phòng học' : 'Thêm phòng học mới'}
      visible={visible}
      onCancel={() => {
        setVisible(false);
        form.resetFields();
      }}
      onOk={() => form.submit()}
      confirmLoading={submitLoading}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="maPhong"
          label="Mã phòng"
          rules={[
            { validator: validateMaPhongField },
            { max: 10, message: 'Mã phòng không được quá 10 ký tự' }
          ]}
        >
          <Input placeholder="Nhập mã phòng" maxLength={10} />
        </Form.Item>

        <Form.Item
          name="tenPhong"
          label="Tên phòng"
          rules={[
            { validator: validateTenPhongField },
            { max: 50, message: 'Tên phòng không được quá 50 ký tự' }
          ]}
        >
          <Input placeholder="Nhập tên phòng" maxLength={50} />
        </Form.Item>

        <Form.Item
          name="soChoNgoi"
          label="Số chỗ ngồi"
          rules={[
            { required: true, message: 'Vui lòng nhập số chỗ ngồi' },
            { type: 'number', min: 10, message: 'Số chỗ ngồi tối thiểu là 10' },
            { type: 'number', max: 200, message: 'Số chỗ ngồi tối đa là 200' }
          ]}
        >
          <InputNumber 
            style={{ width: '100%' }} 
            placeholder="Nhập số chỗ ngồi" 
            min={10} 
            max={200}
          />
        </Form.Item>

        <Form.Item
          name="loaiPhong"
          label="Loại phòng"
          rules={[{ required: true, message: 'Vui lòng chọn loại phòng' }]}
        >
          <Select placeholder="Chọn loại phòng">
            {Object.values(LoaiPhong).map(loai => (
              <Option key={loai} value={loai}>{loai}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="nguoiPhuTrach"
          label="Người phụ trách"
          rules={[{ required: true, message: 'Vui lòng chọn người phụ trách' }]}
        >
          <Select placeholder="Chọn người phụ trách">
            {DANH_SACH_NGUOI_PHU_TRACH.map(nguoi => (
              <Option key={nguoi.id} value={nguoi.ten}>{nguoi.ten}</Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormPhongHoc; 