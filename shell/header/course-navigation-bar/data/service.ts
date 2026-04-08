import { getSiteConfig, getAuthenticatedHttpClient, camelCaseObject } from '../../../../runtime';

// Raw API response from /api/course_home/course_metadata/
interface RawCourseTab {
  tab_id: string,
  title: string,
  url: string,
}

interface RawCourseHomeCourseMetadata {
  tabs: RawCourseTab[],
}

export interface CourseTab {
  tabId: string,
  title: string,
  url: string,
}

export interface CourseHomeCourseMetadata {
  tabs: CourseTab[],
}

function normalizeCourseHomeCourseMetadata(metadata: RawCourseHomeCourseMetadata): CourseHomeCourseMetadata {
  const data = camelCaseObject(metadata);
  return {
    tabs: (data.tabs || []).map((tab: CourseTab) => ({
      tabId: tab.tabId === 'courseware' ? 'outline' : tab.tabId,
      title: tab.title,
      url: tab.url,
    })),
  };
}

export async function getCourseHomeCourseMetadata(courseId: string): Promise<CourseHomeCourseMetadata> {
  const { data } = await getAuthenticatedHttpClient().get(`${getSiteConfig().lmsBaseUrl}/api/course_home/course_metadata/${courseId}`);

  return normalizeCourseHomeCourseMetadata(data);
}
