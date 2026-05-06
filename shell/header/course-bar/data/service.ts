import { matchPath } from 'react-router-dom';
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

export function courseHomeCourseMetadataQueryKey(courseId: string): [string, string] {
  return ['org.openedx.frontend.app.header.courseMeta', courseId];
}

/*
 * Returns the tab whose URL pathname is the longest prefix match against
 * `pathname`, or null if none match.  Used by the navigation bar to mark the
 * active tab and by the masquerade redirect to decide whether the demoted
 * user can still see the page they're on.
 */
export function findActiveTab(tabs: CourseTab[], pathname: string): CourseTab | null {
  let best: { tab: CourseTab, length: number } | null = null;
  for (const tab of tabs) {
    const tabPathname = new URL(tab.url).pathname;
    const match = matchPath({ path: `${tabPathname}/*`, end: false }, pathname);
    if (match && (!best || tabPathname.length > best.length)) {
      best = { tab, length: tabPathname.length };
    }
  }
  return best?.tab ?? null;
}
