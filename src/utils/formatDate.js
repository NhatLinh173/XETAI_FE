export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = `Tháng ${date.getMonth() + 1}`;
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
};
