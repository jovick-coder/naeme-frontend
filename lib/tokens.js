const verifyToken = async () => {
  try {
    const res = await fetch("/api/verify", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (res.status === 200) {
    } else {
      window.location.href = "/signin";
    }
  } catch (err) {
    console.log(err);
  }
};

export async function refreshToken() {
  const response = await fetch("/api/refresh", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status === 200) {
    verifyToken();
  }
}
