import { redirect } from 'next/navigation';
import { Col, Container, Row } from 'react-bootstrap';

import {
  getEmployeeProfile,
  getDepartments,
  getPositions,
} from '@/features/hr/server/models/profiles';
import { UpdateProfileModal } from '@/features/hr/components/ui';
import {
  ShowProfileModalButton,
  NavProfileListButton,
} from '@/features/hr/components/views/profiles/detail';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EmployeeProfile({ params }: Props) {
  const { id } = await params;

  const profile = await getEmployeeProfile(id);
  const departments = await getDepartments();
  const positions = await getPositions();

  if (
    profile.code != 'SU' ||
    departments.code != 'SU' ||
    positions.code != 'SU'
  ) {
    redirect('/', 'push');
  }

  const {
    employeeCode,
    employeeName,
    positionName,
    departmentName,
    teamName,
    phoneNumber,
  } = profile.result;

  const modalKey = 'UpdateProfile';

  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <Container className="my-5">
          <Row>
            <Col>
              <h1 className="text-center mb-4">사원 정보</h1>
            </Col>
          </Row>
          <Row className="justify-content-center mb-3">
            <Col xs={12} md={8} lg={6}>
              <div className="border p-3 rounded">
                <p>
                  <strong>{'사번: '}</strong>
                  {employeeCode}
                </p>
                <p>
                  <strong>{'이름: '}</strong>
                  {employeeName}
                </p>
                <p>
                  <strong>{'직급: '}</strong>
                  {positionName}
                </p>
                <p>
                  <strong>{'부서: '}</strong>
                  {departmentName}
                </p>
                <p>
                  <strong>{'팀: '}</strong>
                  {teamName}
                </p>
                <p>
                  <strong>{'전화번호: '}</strong>
                  {phoneNumber}
                </p>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs="auto">
              <ShowProfileModalButton modalKey={modalKey} />
              <NavProfileListButton />
            </Col>
          </Row>
        </Container>
      </div>
      <UpdateProfileModal
        modalKey={modalKey}
        profiles={profile.result}
        departments={departments.result}
        positions={positions.result}
      />
    </>
  );
}
