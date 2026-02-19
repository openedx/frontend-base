import { getSiteConfig, getAuthenticatedHttpClient, camelCaseObject } from '../../../../runtime';

export const getCourseMetadataApiUrl = (courseId: string) => `${getSiteConfig().lmsBaseUrl}/api/course_home/course_metadata/${courseId}`;

export interface CourseTab {
  tabId: string,
  title: string,
  url: string,
}
export interface CourseHomeCourseMetadata {
  tabs: CourseTab[],
  isMasquerading: boolean,
}

function normalizeCourseHomeCourseMetadata(metadata: CourseHomeCourseMetadata): CourseHomeCourseMetadata {
  const data = camelCaseObject(metadata);
  return {
    ...data,
    tabs: (data.tabs || []).map((tab: CourseTab) => ({
      tabId: tab.tabId === 'courseware' ? 'outline' : tab.tabId,
      title: tab.title,
      url: tab.url,
    })),
    isMasquerading: data.originalUserIsStaff && !data.isStaff,
  };
}

export async function getCourseHomeCourseMetadata(courseId: string): Promise<CourseHomeCourseMetadata> {
  const url = getCourseMetadataApiUrl(courseId);
  const { data } = await getAuthenticatedHttpClient().get(url);

  return normalizeCourseHomeCourseMetadata(data);
}
