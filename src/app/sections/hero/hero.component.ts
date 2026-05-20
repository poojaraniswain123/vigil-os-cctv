 /* =========================
            CAMERA ANGLE CHANGE
        ========================= */

        const camera =
            document.getElementById("camera");

        let angle = 0;

        camera.addEventListener("click", () => {

            angle++;

            if(angle === 1){

                camera.className =
                    "camera left";

            }

            else if(angle === 2){

                camera.className =
                    "camera right";

            }

            else{

                camera.className =
                    "camera center";

                angle = 0;

            }

        });

        /* =========================
            PARTICLES
        ========================= */

        const canvas =
            document.getElementById("particles");

        const ctx =
            canvas.getContext("2d");

        canvas.width =
            window.innerWidth;

        canvas.height =
            window.innerHeight;

        let particles = [];

        class Particle{

            constructor(){

                this.x =
                    Math.random() * canvas.width;

                this.y =
                    Math.random() * canvas.height;

                this.size =
                    Math.random() * 2 + 1;

                this.speedY =
                    Math.random() * 1 + .2;

                this.opacity =
                    Math.random();

            }

            update(){

                this.y -= this.speedY;

                if(this.y < 0){

                    this.y = canvas.height;

                    this.x =
                        Math.random() * canvas.width;

                }

            }

            draw(){

                ctx.fillStyle =
                    `rgba(0,255,255,${this.opacity})`;

                ctx.beginPath();

                ctx.arc(
                    this.x,
                    this.y,
                    this.size,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }

        }

        for(let i = 0; i < 120; i++){

            particles.push(new Particle());

        }

        function animate(){

            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            particles.forEach(p => {

                p.update();
                p.draw();

            });

            requestAnimationFrame(animate);

        }

        animate();

        /* resize */

        window.addEventListener("resize", () => {

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

        });
