import { Col, Container, Row, Table } from 'react-bootstrap';

import {
  EmployeeProfileListRequestDto,
  EmployeeProfileListResponseDto,
} from '@/features/hr/schema';
import { CustomPagination } from '@/common/components/layouts';
import { SortChevron } from '@/common/components/ui';
import ProfilesTableRows from './profiles-table-rows';

interface Props {
  data: EmployeeProfileListResponseDto;
  params: EmployeeProfileListRequestDto;
}

export default function ProfilesTable(props: Props) {
  const {
    data: { content, ...pageMeta },
    params,
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
                  <SortChevron
                    sortOrderParam={params.sortOrder}
                    sortPathParam={params.sortPath}
                    sortPath="employee"
                  />
                </th>
                <th className="text-center" style={{ width: '11%' }}>
                  이름
                </th>
                <th className="text-center" style={{ width: '15%' }}>
                  연락처
                </th>
                <th className="text-center" style={{ width: '15%' }}>
                  부서
                  <SortChevron
                    sortOrderParam={params.sortOrder}
                    sortPathParam={params.sortPath}
                    sortPath="department"
                  />
                </th>
                <th className="text-center" style={{ width: '10%' }}>
                  직급
                  <SortChevron
                    sortOrderParam={params.sortOrder}
                    sortPathParam={params.sortPath}
                    sortPath="position"
                  />
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
                <ProfilesTableRows profile={profile} key={profile.employeeId} />
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
