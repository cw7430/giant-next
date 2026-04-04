import { Col, Container, Row, Table } from 'react-bootstrap';

import { EmployeeProfileListResponseDto } from '@/features/hr/schema';
import { CustomPagination } from '@/common/components/layouts';

interface Props {
  data: EmployeeProfileListResponseDto;
}

export default function ProfilesTable(props: Props) {
  const {
    data: { content, ...pageMeta },
  } = props;

  return (
    <Container>
      <Row>
        <Col xs={12}>
          <Table bordered hover>
            <thead className="table-dark">
              <tr>
                <th className="text-center" style={{ width: '10%' }}>
                  사번
                </th>
                <th className="text-center" style={{ width: '11%' }}>
                  이름
                </th>
                <th className="text-center" style={{ width: '15%' }}>
                  연락처
                </th>
                <th className="text-center" style={{ width: '15%' }}>
                  부서
                </th>
                <th className="text-center" style={{ width: '10%' }}>
                  직급
                </th>
                <th className="text-center" style={{ width: '15%' }}>
                  등록일
                </th>
                <th className="text-center" style={{ width: '15%' }}>
                  수정일
                </th>
              </tr>
            </thead>
            <tbody>
              {content.map((profile) => (
                <tr key={profile.employeeId} style={{ cursor: 'pointer' }}>
                  <td>{profile.employeeCode}</td>
                  <td>{profile.employeeName}</td>
                  <td>{profile.phoneNumber}</td>
                  <td>{profile.departmentName}</td>
                  <td>{profile.positionName}</td>
                  <td>{profile.createdAt.toLocaleDateString()}</td>
                  <td>{profile.updatedAt.toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="auto">
          <CustomPagination data={pageMeta} />
        </Col>
      </Row>
    </Container>
  );
}
