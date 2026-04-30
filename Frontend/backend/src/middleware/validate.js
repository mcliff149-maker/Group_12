/**
 * Zod-based request validation middleware factory.
 *
 * Usage:  router.post('/path', validate(MyZodSchema), handler)
 *
 * Validates req.body against the schema and returns 422 with
 * field-level errors if validation fails.
 */
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map(e => ({
        field:   e.path.join('.'),
        message: e.message,
      }));
      return res.status(422).json({ message: 'Validation failed.', errors });
    }
    req.body = result.data;
    next();
  };
}
