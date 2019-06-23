import Swal from 'sweetalert2';

export function swalError(msj, time){
  Swal.fire({
    position: 'center',
    type: 'error',
    title: msj,
    showConfirmButton: false,
    timer: time
  })
}

export function swalSuccess(msj, time){
  Swal.fire({
    position: 'center',
    type: 'success',
    title: msj,
    showConfirmButton: false,
    timer: time
  })
}
