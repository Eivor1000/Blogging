import xss from 'xss';

export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';

  // Strip all HTML tags for text-only fields
  return xss(input, {
    whiteList: {},
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script']
  });
}

export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') return '';

  // Allow safe HTML tags for content
  return xss(input, {
    whiteList: {
      p: [],
      br: [],
      strong: [],
      em: [],
      u: [],
      h1: [],
      h2: [],
      h3: [],
      h4: [],
      h5: [],
      h6: [],
      ul: [],
      ol: [],
      li: [],
      blockquote: []
    },
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script']
  });
}

export function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeInput(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }

  return obj;
}