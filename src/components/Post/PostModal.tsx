import { storage } from "@/fiebase/db";
import { useAuthUser, useDoc, setData, useCol } from "@/fiebase/dbHooks";
import { getStorageUrl } from "@/utils/firebaseUtils";
import { updateDoc, where } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import React from "react";
import Select from "react-select";

import Form from "../Form";

const AddPostModal = ({
  postId,
  domId,
}: {
  postId?: string;
  domId?: string;
}) => {
  const { userId, user } = useAuthUser();
  const [userDoc] = useDoc<User>(`users/${userId}`);
  const [categories] = useCol<Category>(`categories`);
  const [postDoc] = useDoc<Post>("posts/" + postId);

  const departmentId = userDoc?.data()?.department;

  const QACQuery = !!departmentId
    ? [where(`department`, "==", departmentId)]
    : [];

  const [QAC] = useCol<User>(
    `users`,
    {},
    where("role", "==", "QA Coordinator"),
    ...QACQuery
  );
  const QACEmail = QAC?.docs[0]?.data().email;
  console.log("🚀 ~ file: PostModal.tsx:36 ~ QACEmail:", QACEmail);
  // const QACEmail =QAC && QAC.
  const options = categories?.docs.map((d) => {
    return {
      value: d.id,
      label: d?.data().name,
    };
  });
  const post = postDoc?.data();

  const tags = (post?.tags ? Object.entries(post.tags) : []).map((t) => {
    return {
      label: t[1],
      value: t[0],
    };
  });
  const sendEmail = () => {
    const name = userDoc?.data()?.name;

    fetch("/api/email", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ name, email: QACEmail }),
      // body: JSON.stringify({ a: 1, b: 2 }),
    });
  };

  const clearForm = (form: any) => {
    form.reset({
      msg: "",
      tags: [],
    });
    (document.getElementById("postImgUpload") as HTMLInputElement).value = "";
    (document.getElementById(domId as string) as HTMLInputElement).checked =
      false;
  };

  const prepareData = (val: any): Post => {
    const tags: Post["tags"] = {};
    val?.tags?.forEach((a: any) => {
      tags[a.value] = a.label;
    });

    const data: Post = {
      createdAt: new Date(),
      commentCount: 0,
      title: val.msg,
      img: "",
      user: userDoc?.ref,
      department: userDoc?.data()?.department,
      tags: tags,
      anonymous: !!val?.anonymous,
    };

    return data;
  };
  const updatePost = (val: any, form: any) => {
    if (postDoc?.ref) {
      const file = val.img && val.img[0];
      const storageRef = ref(storage, `posts/${new Date().toISOString()}`);
      const data = prepareData(val);

      if (file) {
        uploadBytes(storageRef, file).then(({ ref }) => {
          data.img = getStorageUrl(ref);
          updateDoc(postDoc?.ref, data);
          sendEmail();
          clearForm(form);
        });
      } else {
        updateDoc(postDoc?.ref, data);
        clearForm(form);
      }
    }
  };

  const addPost = async (val: any, form: any) => {
    const file = val.img && val.img[0];
    const storageRef = ref(storage, `posts/${new Date().toISOString()}`);
    const data: Post = prepareData(val);

    if (file) {
      uploadBytes(storageRef, file).then(({ ref }) => {
        data.img = getStorageUrl(ref);
        setData(`posts`, data);
        sendEmail();
        clearForm(form);
      });
    } else {
      setData(`posts`, data);
      sendEmail();
      clearForm(form);
    }
  };

  return (
    <>
      <input type="checkbox" id={domId} className="modal-toggle" />
      <label htmlFor={domId} className="modal cursor-pointer">
        <label className="modal-box relative flex flex-col gap-4" htmlFor="">
          <h3 className="text-3xl font-bold">Create your post</h3>
          <Form
            onSubmit={!!postId ? updatePost : addPost}
            defaults={{
              msg: post?.title || "",
              ...post,
              tags: tags,
            }}
            className="flex flex-col gap-4"
          >
            {(props) => {
              const msg = props.watch("msg");
              return (
                <>
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="z-40 flex flex-col space-y-2"
                  >
                    <label className="text-sm" htmlFor="tags">
                      Tags
                    </label>
                    <Select
                      className="z-50 flex-grow "
                      isMulti
                      required
                      value={props.values.tags}
                      onChange={(val) => {
                        props.setValue("tags", val);
                      }}
                      name="tags"
                      options={options}
                    />
                  </div>
                  <div className="mb-2 flex flex-col space-y-2">
                    <label className="text-sm" htmlFor="message">
                      Message
                    </label>
                    <textarea
                      className="textarea-bordered textarea h-24 w-full resize-none leading-5"
                      placeholder="Make your ideas come to life"
                      value={msg}
                      defaultValue=""
                      id="message"
                      required
                      {...props.register("msg")}
                    ></textarea>
                  </div>
                  <div>
                    <input
                      id="postImgUpload"
                      type="file"
                      name="img"
                      onChange={props.onChange}
                      className="file-input-bordered file-input-primary file-input w-full max-w-xs text-sm"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        name="anonymous"
                        className="checkbox"
                        checked={props.values.anonymous}
                        onChange={props.onChange}
                      />
                      <span className="label-text font-bold">
                        Post as anonymous
                      </span>
                    </label>
                  </div>
                  <div className="flex">
                    <button type="submit" className="btn-primary btn ml-auto">
                      Post
                    </button>
                  </div>
                </>
              );
            }}
          </Form>
        </label>
      </label>
    </>
  );
};

export default AddPostModal;
