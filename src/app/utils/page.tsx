export const handleLoginSubmit = async (e, login, onLoginOpenChange) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const formDataObj = {};
  formData.forEach((value, key) => {
    formDataObj[key] = value;
  });

  try {
    const response = await fetch("/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formDataObj),
    });

    const data = await response.json();
    if (response.ok) {
      alert("登录成功");
      login(data);
      onLoginOpenChange(false);
    } else {
      alert("登录失败");
    }
  } catch (error) {
    console.error("登录请求出错:", error);
  }
};

export const handleRegisterSubmit = async (e, onRegisterOpenChange) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const formDataObj = {};
  formData.forEach((value, key) => {
    formDataObj[key] = value;
  });

  try {
    const response = await fetch("/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formDataObj),
    });

    const data = await response.json();
    if (response.ok) {
      alert("注册成功");
      onRegisterOpenChange(false);
    } else {
      console.error("注册失败:", data.message);
    }
  } catch (error) {
    console.error("注册请求出错:", error);
  }
};

export const uploadFile = async (file) => {
  if (!file) {
    alert("请先选择文件");
    return null;
  }
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    if (response.ok) {
      return result.url; // 返回文件 URL
    } else {
      console.error("文件上传失败:", result.message);
      return null;
    }
  } catch (error) {
    console.error("文件上传出错:", error);
    return null;
  }
};
