import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const date = new Date(value);

          if (isNaN(date.getTime())) {
            return false;
          }

          return date > new Date();
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a future date`;
        },
      },
    });
  };
}