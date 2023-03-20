export function formatDate(value) {
  if (!value) {
    return '';
  }
  let d = new Date(value);
  let year = d.getFullYear();
  let month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
  let day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
  return  year + '-' + month + '-' + day;
}




export default {
  formatDate,
}
