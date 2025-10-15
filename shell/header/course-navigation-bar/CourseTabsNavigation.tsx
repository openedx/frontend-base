import { useQuery } from '@tanstack/react-query';
import { useIntl } from '../../../runtime';
import classNames from 'classnames';
import { getCourseHomeCourseMetadata } from './data/service';
import { Tab, Tabs } from '@openedx/paragon';
import messages from './messages';
import { useNavigate, useLocation } from 'react-router-dom';
import './course-tabs-navigation.scss';

interface CourseMetaData {
  tabs: {
    title: string,
    slug: string,
    url: string,
  }[],
  isMasquerading: boolean,
}

const CourseTabsNavigation = () => {
  const location = useLocation();
  const intl = useIntl();
  const navigate = useNavigate();

  const extractCourseId = (pathname: string): string => {
    const courseRegex = /\/courses?\/([^/]+)/;
    const courseMatch = courseRegex.exec(pathname);
    return courseMatch ? courseMatch[1] : '';
  };

  const courseId = extractCourseId(location.pathname);

  const { data } = useQuery({
    queryKey: ['org.openedx.frontend.app.header.course-meta', courseId],
    queryFn: () => getCourseHomeCourseMetadata(courseId),
    retry: 2,
  });

  if (!courseId) {
    return null;
  }

  const { tabs = [] }: CourseMetaData = data ?? {};

  const handleSelectedTab = (eventKey) => {
    const selectedUrl = tabs.find(tab => tab.slug === eventKey)?.url ?? '/';

    try {
      if (selectedUrl.startsWith('http://') || selectedUrl.startsWith('https://')) {
        const url = new URL(selectedUrl);
        if (url.origin === window.location.origin) {
          navigate(url.pathname + url.search + url.hash);
        } else {
          window.location.href = selectedUrl;
        }
      } else {
        navigate(selectedUrl);
      }
    } catch (error) {
      navigate(selectedUrl);
    }
  };

  return (
    <div id="courseTabsNavigation" className={classNames('course-tabs-navigation')}>
      <div className="container-xl">
        <div className="nav-bar">
          <div className="nav-menu">
            <Tabs className="nav-underline-tabs" aria-label={intl.formatMessage(messages.courseMaterial)} onSelect={handleSelectedTab}>
              {tabs.map(({ title, slug }) => (
                <Tab eventKey={slug} title={title} key={slug} />
              ))}
            </Tabs>
          </div>
          {/* <div className="search-toggle">
            <CoursewareSearchToggle />
          </div>
        </div>
      </div>
      {show && <CoursewareSearch />} */}
        </div>
      </div>
    </div>
  );
};

export default CourseTabsNavigation;
