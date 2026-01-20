const BASE_URL = "http://localhost:3100/api/v1";

const request = async function <T>(
  endpoint: string,
  options: {
    method?: "POST" | "GET" | "DELETE" | "PUT";
    body?: any;
    headers?: Record<string, any>;
  } = {}
): Promise<T> {
  try {
    const bearer_token = localStorage.getItem("Helix_user_token") ?? "";

    const headers = {
      ...(bearer_token.trim().length > 0 && {
        Authorization: `Bearer ${bearer_token}`,
      }),
      ...options.headers,
    };

    // console.log("Headers: ", headers);

    const response = await fetch(BASE_URL + endpoint, {
      method: options.method ?? "GET",
      ...(options.body && { body: options.body }),
      headers,
    });

    const output = await response.json();
    // console.log(JSON.stringify(output));

    if (response.ok != true) {
      throw new Error(
        output.error ??
          (await response.text()) ??
          "Something went wrong, try again"
      );
    }

    if (output.status !== "success") {
      throw new Error(output.error ?? "Internal Server error");
    }

    return (output.payload || output.data) as T;
  } catch (error) {
    console.log(error instanceof Error ? error.message : error);
    throw error instanceof Error
      ? error.message
      : "Something went wrong, try again";
  }
};

async function myRandomTests() {
  var raw = JSON.stringify({
    email: "langmaster_test@gmail.com",
    password: "@Langmaster1",
  });

  var requestOptions = {
    method: "POST",
    body: raw,
    // redirect: "follow",
  };

  await fetch("https://lang-learn-app-app-production.up.railway.app/v1/api/login", {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

export { request, myRandomTests };
