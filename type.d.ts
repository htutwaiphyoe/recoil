type Post = {
  id?: string;
  user: DocumentReference;
  title: string;
  img?: string;
  tags: {
    [key: string]: boolean;
  };
  createdAt: Timestamp;
  commentCount: number;
  anonymous: boolean;
  likes?: {
    [key: string]: boolean;
  };
  dislikes?: {
    [key: string]: boolean;
  };
  department?: string;
  views?: {
    [key: string]: boolean;
  };
};

type ChildFunc<T> = (arg: T) => ReactNode;

type ElementState = "" | "loading" | "disable" | "error";

type Tab = {
  name: string;
  key: string;
  Render: React.FC<any>;
  icon: React.ReactElement;
};

type Category = {
  id?: string;
  name: string;
};

type User = {
  name: string;
  email: string;
  role: string;
  department: string;
  agreedTerms: boolean;
  isActive: boolean;
};

type Closures = {
  closureDate: Timestamp;
  finalClosureDate: Timestamp;
  isActive: boolean;
};

type DatePickerProps = {
  value: Date;
  onChange: (value: Date) => void;
  name?: string;
  label?: string;
  error?:
    | string
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<any>>
    | undefined;
};

type Department = {
  name: string;
};

type Account = {
  name: string;
  email: string;
  password: string;
  department: string;
  role: string;
  isActive: boolean;
  agreedTerms?: boolean;
};

type LoggedInUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  isActive: boolean;
  agreedTerms?: boolean;
};

type Category = {
  name: string;
};
