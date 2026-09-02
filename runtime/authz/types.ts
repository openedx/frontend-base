export interface PermissionValidationRequestItem {
  action: string;
  scope?: string;
}

export interface PermissionValidationResponseItem extends PermissionValidationRequestItem {
  allowed: boolean;
}

export type PermissionValidationQuery = Record<string, PermissionValidationRequestItem>;

/**
 * Maps each key from the caller's query to a boolean allowed value.
 * The generic form preserves exact key names for autocomplete and typo detection.
 * Use the default (non-generic) form when the query shape is not statically known.
 *
 * @example
 * const query = { canEdit: { action: 'courses.edit' } } satisfies PermissionValidationQuery;
 * const answer: PermissionValidationAnswer<typeof query> = { canEdit: true };
 */
export type PermissionValidationAnswer<
  Query extends PermissionValidationQuery = PermissionValidationQuery,
> = {
  [K in keyof Query]: boolean;
};
