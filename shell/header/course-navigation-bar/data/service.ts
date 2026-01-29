import { getSiteConfig, getAuthenticatedHttpClient, camelCaseObject } from '../../../../runtime';

export const getCourseMetadataApiUrl = (courseId) => `${getSiteConfig().lmsBaseUrl}/api/course_home/course_metadata/${courseId}`;

function normalizeCourseHomeCourseMetadata(metadata) {
  const data = camelCaseObject(metadata);
  return {
    ...data,
    tabs: (data.tabs || []).map(tab => ({
      slug: tab.tabId === 'courseware' ? 'outline' : tab.tabId,
      title: tab.title,
      url: tab.url,
    })),
    isMasquerading: data.originalUserIsStaff && !data.isStaff,
  };
}

export async function getCourseHomeCourseMetadata(courseId) {
  const url = getCourseMetadataApiUrl(courseId);
  const { data } = await getAuthenticatedHttpClient().get(url);

  return normalizeCourseHomeCourseMetadata(data);
}
