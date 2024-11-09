import { signIn, useAuthUser } from "@/fiebase/dbHooks";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Form from "@/components/Form";
import { Loader } from "@/components/UI/Loader";
import { LoginHead } from "@/components/Meta/Meta";

const Login = () => {
  const { user, loading, error } = useAuthUser();
  const router = useRouter();

  if (loading) return <Loader />;

  if (user) {
    router.replace("/");
    return <></>;
  }

  return (
    <>
      <LoginHead />
      <section className="h-screen md:grid md:grid-cols-2">
        <div className="hidden h-full w-full flex-row items-center justify-center bg-blue p-5 md:flex">
          <h1 className="text-center text-5xl font-bold leading-snug text-white">
            Welcome to <br /> Columbia University
          </h1>
        </div>
        <div className="flex h-full w-full flex-row items-center justify-center bg-white">
          <Form
            onSubmit={async (val) => {
              await signIn(val.email, val.password)
                .then(() => {})
                .catch(() => {
                  toast.error("Email or Password is incorrect");
                });
            }}
          >
            {(props) => {
              return (
                <div className="card w-full px-3 xxs:w-[300px] xxs:px-0">
                  <div className="card-body p-0">
                    <div className="text-[40px] font-bold">Login</div>
                    <div className="form-control mb-1 w-full">
                      <label className="mb-2 text-sm" htmlFor="email">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        placeholder="Enter email address"
                        name="email"
                        onChange={props.onChange}
                        className="input-bordered input w-full border-grey-input py-5 text-base"
                      />
                    </div>
                    <div className="form-control mb-4 w-full">
                      <label className="mb-2 text-sm" htmlFor="password">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        required
                        onChange={props.onChange}
                        placeholder="Enter password"
                        name="password"
                        className="input-bordered input w-full border-grey-input py-5 text-base"
                      />
                    </div>
                    <div className="flex flex-row justify-end">
                      <button
                        className="btn h-auto border-none bg-blue px-4 text-base text-white outline-none hover:bg-blue"
                        type="submit"
                        disabled={props.formState.isSubmitting}
                      >
                        Log in
                      </button>
                    </div>
                  </div>
                </div>
              );
            }}
          </Form>
        </div>
      </section>
    </>
  );
};

export default Login;
