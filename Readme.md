## Membuat Load Balancer

Load balancer itu adalah metode untuk membagi beban traffic yang masuk ke server. Tujuan dari adanya load balancer ini adalah mempercepat waktu response dan mecegahnya dari overloading sehingga akan meningkatkan kinerja server kita.

Misal kita ada beberapa aplikasi (anggap saja ada 2 aplikasi) yang sama dan kita run dengan server yang berbeda (di aplikasi ini kita hanya membedakan port-nya saja). Dengan adanya load balancer maka kita bisa membagi request yang masuk ke kedua aplikasi kita. Metode pembagian yang paling sederhana adalah dengan metode round robin (intinya adalah dibagi secara berurut dan kalau sudah ke n aplikasi maka akan kembali ke aplikasi pertama (bergiliran kalau istilah sederhananya))
