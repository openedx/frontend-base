import { useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Slot, useIntl } from '../../../../runtime';
import {
  CourseTab,
  courseHomeCourseMetadataQueryKey,
  findActiveTab,
  getCourseHomeCourseMetadata,
} from '../data/service';
import { Container, Nav, Navbar, Skeleton } from '@openedx/paragon';
import messages from './messages';
import { isClientRoute } from '../utils';
import './course-tabs-navigation.scss';

interface ResolvedTab extends CourseTab {
  pathname: string,
  clientPath: string | null,
}

const CourseTabsNavigation = () => {
  const location = useLocation();
  const { courseId = '' } = useParams();
  const intl = useIntl();

  const { data = { tabs: [] }, isLoading } = useQuery({
    queryKey: courseHomeCourseMetadataQueryKey(courseId),
    queryFn: () => getCourseHomeCourseMetadata(courseId),
    retry: 2,
    enabled: !!courseId,
  });

  const { tabs } = data;

  const resolvedTabs: ResolvedTab[] = useMemo(
    () => tabs.map(tab => {
      // Tab URLs from the course_home API are always absolute.
      const pathname = new URL(tab.url).pathname;
      return { ...tab, pathname, clientPath: isClientRoute(pathname) ? pathname : null };
    }),
    [tabs]
  );

  const currentTab = useMemo(
    () => (resolvedTabs.length > 0 ? findActiveTab(resolvedTabs, location.pathname)?.tabId ?? null : null),
    [location.pathname, resolvedTabs]
  );

  if (isLoading) {
    return <Skeleton className="lead mt-3" />;
  }

  if (!courseId || resolvedTabs.length === 0) {
    return null;
  }

  return (
    <Navbar expand="sm" className="course-tabs-navigation pb-0" aria-label={intl.formatMessage(messages.courseMaterial)}>
      <Container fluid size="xl">
        <Nav
          variant="tabs"
          activeKey={currentTab}
        >
          <Navbar.Toggle aria-controls="course-nav" />
          <Navbar.Collapse id="course-nav">
            {
              resolvedTabs.map(tab => (
                <Nav.Item key={tab.tabId}>
                  <Nav.Link
                    {...(tab.clientPath
                      ? { to: tab.clientPath, as: Link }
                      : { href: tab.url }
                    )}
                    active={tab.tabId === currentTab}
                  >
                    {tab.title}
                  </Nav.Link>
                </Nav.Item>
              ))
            }
          </Navbar.Collapse>
          <Slot id="org.openedx.frontend.slot.header.courseNavigationBar.extraContent.v1" />
        </Nav>
      </Container>
    </Navbar>
  );
};

export default CourseTabsNavigation;
