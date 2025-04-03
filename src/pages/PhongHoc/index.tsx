import type { IColumn } from '@/components/Table/typing';
import { Button, Card, Col, Input, message, Popconfirm, Row, Space, Table, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormPhongHoc from './Form';
import moment from 'moment';
import { Modal } from 'antd';
import { LOAI_PHONG_FILTERS, NGUOI_PHU_TRACH_FILTERS } from '@/services/PhongHoc/constants';

const { confirm } = Modal;
const { Search } = Input;

const PhongHocPage = () => {
  const { 
    data, 
    getPhongHocData, 
    setRow, 
    deletePhongHoc,
    isEdit, 
    setVisible, 
    setIsEdit, 
    visible,
    loading,
    page,
    setPage,
    limit,
    setLimit,
    total,
    searchValue,
    filteredData,
    handleSearch
  } = useModel('phonghoc');
  
  useEffect(() => {
    getPhongHocData();
  }, []);

  const columns: IColumn<PhongHoc.IRecord>[] = [
    {
      title: 'Mã phòng',
      dataIndex: 'maPhong',
      key: 'maPhong',
      width: 120,
      sorter: (a, b) => a.maPhong.localeCompare(b.maPhong),
    },
    {
      title: 'Tên phòng',
      dataIndex: 'tenPhong',
      key: 'tenPhong',
      width: 200,
      sorter: (a, b) => a.tenPhong.localeCompare(b.tenPhong),
    },
    {
      title: 'Số chỗ ngồi',
      dataIndex: 'soChoNgoi',
      key: 'soChoNgoi',
      width: 150,
      sorter: (a, b) => a.soChoNgoi - b.soChoNgoi,
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Loại phòng',
      dataIndex: 'loaiPhong',
      key: 'loaiPhong',
      width: 150,
      filters: LOAI_PHONG_FILTERS,
      onFilter: (value, record) => record.loaiPhong === value,
    },
    {
      title: 'Người phụ trách',
      dataIndex: 'nguoiPhuTrach',
      key: 'nguoiPhuTrach',
      width: 200,
      filters: NGUOI_PHU_TRACH_FILTERS,
      onFilter: (value, record) => record.nguoiPhuTrach === value,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (text) => moment(text).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                setVisible(true);
                setRow(record);
                setIsEdit(true);
              }}
            />
          </Tooltip>
          <Tooltip title={record.soChoNgoi >= 30 ? "Không thể xóa phòng có từ 30 chỗ ngồi trở lên" : "Xóa"}>
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => {
                if (record && record._id) {
                  deletePhongHoc(record._id)
                    .then(() => message.success('Xóa phòng học thành công'))
                    .catch(err => {
                      if (err.message !== 'Người dùng hủy xóa') {
                        console.error(err);
                        message.error('Xảy ra lỗi khi xóa phòng học');
                      }
                    });
                } else {
                  message.error('Không tìm thấy mã phòng học để xóa');
                }
              }}
              disabled={record.soChoNgoi >= 30}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="card-container">
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Row gutter={16} align="middle">
            <Col span={12}>
              <h2 style={{ margin: 0 }}>Quản lý phòng học</h2>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                onClick={() => {
                  setVisible(true);
                  setIsEdit(false);
                  setRow(undefined);
                }}
                style={{ marginLeft: 8 }}
              >
                Thêm phòng học
              </Button>
            </Col>
          </Row>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="Tìm kiếm theo mã phòng hoặc tên phòng"
            allowClear
            enterButton={<SearchOutlined />}
            size="middle"
            value={searchValue}
            onChange={e => handleSearch(e.target.value)}
            onSearch={handleSearch}
            style={{ width: 400 }}
          />
          <span style={{ marginLeft: 16 }}>
            Tìm thấy {filteredData.length} phòng học
          </span>
        </div>

        <Table 
          rowKey="_id"
          dataSource={filteredData} 
          columns={columns}
          loading={loading}
          pagination={{
            current: page,
            pageSize: limit,
            total: filteredData.length,
            onChange: (p) => setPage(p),
            onShowSizeChange: (_, size) => setLimit(size),
            showSizeChanger: true,
            showTotal: (t) => `Tổng số ${t} phòng học`,
          }}
        />
      </Card>

      <FormPhongHoc
        visible={visible}
        setVisible={setVisible}
        isEdit={isEdit}
      />
    </div>
  );
};

export default PhongHocPage; 