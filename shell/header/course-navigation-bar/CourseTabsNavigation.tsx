import { useMemo } from 'react';
import { Link, matchPath, useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Slot, useIntl } from '../../../runtime';
import { CourseTab, getCourseHomeCourseMetadata } from './data/service';
import { Nav, Navbar, Skeleton } from '@openedx/paragon';
import messages from './messages';
import { isClientRoute } from './utils';
import './course-tabs-navigation.scss';

interface ResolvedTab extends CourseTab {
  pathname: string,
  clientPath: string | null,
}

/*
 * Returns the tabId of the tab whose pathname is the longest prefix match
 * against the current path. Uses react-router's matchPath for segment-aware
 * matching.
 *
 * For example, given tabs with paths /course/ (tabId: "outline")
 * and /course/dates/ (tabId: "dates"):
 *
 *   /course/dates/foo  -> "dates"   (longest prefix match)
 *   /course/outline    -> "outline"
 *   /courseware        -> null      (not a segment boundary)
 */
const getActiveTabId = (currentPath: string, tabs: ResolvedTab[]): string | null => {
  let best: ResolvedTab | null = null;
  for (const tab of tabs) {
    const match = matchPath({ path: `${tab.pathname}/*`, end: false }, currentPath);
    if (match && (!best || tab.pathname.length > best.pathname.length)) {
      best = tab;
    }
  }
  return best?.tabId ?? null;
};

const CourseTabsNavigation = () => {
  const location = useLocation();
  const { courseId = '' } = useParams();
  const intl = useIntl();

  const { data = { tabs: [] }, isLoading } = useQuery({
    queryKey: ['org.openedx.frontend.app.header.course-meta', courseId],
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
    () => resolvedTabs.length > 0 ? getActiveTabId(location.pathname, resolvedTabs) : null,
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
    </Navbar>
  );
};

export default CourseTabsNavigation;
