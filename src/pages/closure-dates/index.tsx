import Layout from "@/components/Layout";
import { useCol } from "@/fiebase/dbHooks";
import { Loader } from "@/components/UI/Loader";
import Form from "@/components/Form";
import toast from "react-hot-toast";
import { updateDoc } from "firebase/firestore";
import { closureSchema } from "@/utils/schema";
import { ClosureDateHead } from "@/components/Meta/Meta";
import DatePickerInput from "@/components/Input/DatePicker";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { LoggedInUserAtom } from "@/state";
import { roles } from "@/utils/data";
import { useRouter } from "next/router";

const closureRouteRoles = [roles.admin];

export default function ClosureDate() {
  const [value, loading] = useCol<Closures>("closures");
  const [submitting, setSubmitting] = useState(false);
  const closureData = value?.docs[0].data();
  const loggedInUser = useRecoilValue(LoggedInUserAtom);
  const router = useRouter();

  if (loggedInUser.role && !closureRouteRoles.includes(loggedInUser.role)) {
    router.replace("/");
    return <></>;
  }

  const initialValues = {
    closureDate: closureData ? closureData?.closureDate?.toDate() : new Date(),
    finalClosureDate: closureData
      ? closureData?.finalClosureDate?.toDate()
      : new Date(),
    isActive: closureData ? closureData?.isActive : false,
  };

  const saveClosure = async (val: Closures) => {
    setSubmitting(true);
    const docRef = value?.docs[0].ref;
    docRef
      ? await updateDoc(docRef, val)
          .then(() => toast.success("Closure dates saved."))
          .catch(() => toast.error("An error occurred. Please try again."))
      : toast.error("An error occurred. Please try again.");
    setSubmitting(false);
  };

  return (
    <Layout>
      <ClosureDateHead />
      {loading ? (
        <Loader isFullHeight={false} />
      ) : (
        <section className="px-5">
          <Form
            defaults={initialValues}
            schema={closureSchema}
            onSubmit={saveClosure}
          >
            {(props) => {
              return (
                <div>
                  <h4 className="mb-5 text-4xl font-bold">Closures</h4>
                  <div className="card w-full rounded-lg border border-grey-light p-5">
                    <div className="card-body p-0">
                      <div className="form-control mb-1 w-full">
                        <DatePickerInput
                          label="Closure date"
                          value={props.values.closureDate}
                          onChange={(date) => {
                            props.setValue("closureDate", date);
                          }}
                        />
                      </div>
                      <div className="form-control mb-4 w-full">
                        <DatePickerInput
                          label="Final closure date"
                          value={props.values.finalClosureDate}
                          error={
                            props.formState.errors.finalClosureDate
                              ? props.formState.errors.finalClosureDate?.message
                              : ""
                          }
                          onChange={(date) => {
                            props.setValue("finalClosureDate", date);
                          }}
                        />
                      </div>
                      <div className="form-control mb-3 flex w-full flex-row items-center space-x-2">
                        <label className="label">
                          <p className="text-sm">Set as active</p>
                        </label>
                        <input
                          type="checkbox"
                          name="isActive"
                          className="toggle-primary toggle"
                          checked={props.values.isActive}
                          onChange={props.onChange}
                        />
                      </div>
                      <div className="flex flex-row justify-end">
                        <button
                          className="btn h-auto border-none bg-blue px-4 text-base text-white outline-none hover:bg-blue"
                          type="submit"
                          disabled={submitting}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }}
          </Form>
        </section>
      )}
    </Layout>
  );
}
