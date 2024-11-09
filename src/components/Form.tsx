import { yupResolver } from "@hookform/resolvers/yup";
// import { useMutateQuery } from 'hooks/useQuery'
import { MouseEventHandler, ReactNode, SyntheticEvent, useEffect } from "react";
import {
  FormProvider,
  SetFieldValue,
  SetValueConfig,
  SubmitHandler,
  useForm,
  UseFormReturn,
  UseFormSetValue,
} from "react-hook-form";

// import type { Request, Response, ResponseError } from 'types/Api'
import { AnyObjectSchema, object } from "yup";

export type FormProps<T = unknown> = {
  url?: string;
  style?: object;
  schema?: AnyObjectSchema;
  config?: Request;
  children:
    | ReactNode
    | ChildFunc<
        UseFormReturn &
          T & {
            values: any;
            // states: States;
            isValid?: boolean;
            onChange: (e: any) => void;
          }
      >;
  defaults?: object;
  className?: string;
  transform?: (v: any) => object;
  onError?: (
    err: any & {
      values: any;
      setError: Function;
      setValue: UseFormSetValue<any>;
    }
  ) => void;
  onSuccess?: OnSuccess;
  onSubmit: OnSubmit;
};

type OnSubmit = (values: any, form: UseFormReturn) => void;

export type OnSuccess = (res: Response & { values: any }) => void;

type States = { input: ElementState; button: ElementState };

const Form = ({
  url,
  style,
  schema = object({}),
  defaults,
  children,
  config,
  className,
  transform,
  onError,
  onSuccess,
  onSubmit,
}: FormProps) => {
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaults,
    mode: "onChange",
    reValidateMode: "onChange",
    // delayError: 1000, //1 sec after user stop
  });
  useEffect(() => {
    if (defaults) {
      form.reset(defaults);
    }
  }, [defaults]);
  //   const { mutate, isLoading } = useMutateQuery()

  //   const states: States = {
  //     input: isLoading ? 'disable' : '',
  //     button: isLoading ? 'loading' : !form.formState.isValid ? 'disable' : '',
  //   }

  const handleSubmit: SubmitHandler<any> = async (values, e) => {
    // const newValues = !!transform ? transform(values) : values;

    //@ts-ignore
    await onSubmit(values, form);
    // !url
    //   ? onSuccess && onSuccess({ data: {}, message: 'OK', values })
    //   : mutate(
    //       { url, payload: newValues, ...config },
    //       {
    //         onError: err => {
    //           const setError = (name: never, message: string) => form.setError(name, { type: 'validate', message })
    //           onError && onError({ ...err, values, setError, setValue: form.setValue })
    //         },
    //         onSuccess: res => {
    //           onSuccess && onSuccess({ ...res, values })
    //         },
    //       }
    //     )
  };

  const onChange = (e: any) => {
    if (e.target.type === "file") {
      //@ts-ignore
      return form.setValue(e.target.name, e.target.files);
    }
    if (e.target.type === "checkbox") {
      //@ts-ignore
      return form.setValue(e.target.name, e.target.checked);
    }
    //@ts-ignore
    form.setValue(e.target.name, e.target.value);
  };

  form.watch();

  return (
    <FormProvider {...form}>
      <form
        style={style}
        className={className}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        {typeof children === "function"
          ? children({
              ...form,
              //   states,
              // states: {},
              values: form.getValues(),

              isValid: form.formState.isValid,
              onChange,
            })
          : children}
      </form>
    </FormProvider>
  );
};

export default Form;
