import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Slot, useIntl } from '../../../runtime';
import { getCourseHomeCourseMetadata } from './data/service';
import './course-tabs-navigation.scss';
import { Nav, Navbar, Skeleton } from '@openedx/paragon';
import messages from './messages';

const extractCourseId = (pathname: string): string => {
  const courseRegex = /\/courses?\/([^/]+)/;
  const courseMatch = courseRegex.exec(pathname);
  return courseMatch ? courseMatch[1] : '';
};

const CourseTabsNavigation = () => {
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState<string | null>(null);
  const intl = useIntl();

  const courseId = extractCourseId(location.pathname);

  const { data = { tabs: [], isMasquerading: false }, isLoading } = useQuery({
    queryKey: ['org.openedx.frontend.app.header.course-meta', courseId],
    queryFn: () => getCourseHomeCourseMetadata(courseId),
    retry: 2,
    enabled: !!courseId,
  });

  const { tabs } = data;

  if (isLoading) {
    return <Skeleton className="lead" />;
  }

  if (!courseId || !tabs || tabs.length === 0) {
    return null;
  }

  return (
    <Navbar className="course-tabs-navigation pb-0" ariaLabel={intl.formatMessage(messages.courseMaterial)}>
      <Nav
        variant="tabs"
        activeKey={currentTab}
      >
        {
          tabs.map((tab: { tabId: string, url: string, title: string }) => (
            <Nav.Item key={tab.tabId}>
              <Nav.Link
                href={tab.url}
                active={tab.tabId === currentTab}
                onClick={() => setCurrentTab(tab.tabId)}
              >
                {tab.title}
              </Nav.Link>
            </Nav.Item>
          ))
        }
        <Slot id="org.openedx.frontend.slot.header.courseNavigationBar.extraContent.v1" />
      </Nav>
    </Navbar>
  );
};

export default CourseTabsNavigation;
