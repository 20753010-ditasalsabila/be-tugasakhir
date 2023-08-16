export const validationNotEmpty = {
  message: (args: any) => JSON.stringify({ code: 'validation.notEmpty', params: [args.property] }),
};

export const validationIsObject = {
  message: (args: any) => JSON.stringify({ code: 'validation.isObject', params: [args.property] }),
};
