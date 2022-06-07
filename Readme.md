## Mengaktifkan dan Menonaktifkan Instance API

Di sini kita menambahkan sebuah fungsi untuk mengatur gateway kita supaya instance api yang kita buat bisa di-enable/disable. Kita tambahkan satatus aktif di gaateway kita.

Ketika aplikasi statusnya false(tidak aktif) maka load balancer tidak akan bisa mendistribusikan request ke aplikasi tersebut.
