    // Updated by Tùng on 30/06/2025

    // Tạo scene
    const scene = new THREE.Scene();

    // Tạo camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 150);
    camera.lookAt(0, 0, 0);

    // Tạo renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x111111);
    renderer.shadowMap.enabled = true; // Enable shadows
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.target.set(0, 0, 0);
    controls.update();

    // Ánh sáng cải thiện
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(50, 50, 50);
    pointLight.castShadow = true; // Enable shadows
    scene.add(ambientLight, pointLight);

    // ánh sáng mặt trời
 const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7.5);
scene.add(dirLight);

// ánh đèn sân khấu
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(10, 20, 10);
spotLight.castShadow = true;
scene.add(spotLight);

// tạo cube
        const geometry = new THREE.BoxGeometry(35, 35, 35);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xff0000, 
            metalness: 0.5, 
            roughness: 0.5 
        });
    const cube = new THREE.Mesh(geometry, material);
        cube.castShadow = true;
        cube.receiveShadow = true;
        scene.add(cube);

    // Tạo sphere
    const sphereGeometry = new THREE.SphereGeometry(25, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x0000ff, 
      metalness: 0.5, 
      roughness: 0.5 
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, -20, 0);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere);

    // Tạo cone
    const coneGeometry = new THREE.ConeGeometry(25, 50, 32);
    const coneMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffff00, 
      metalness: 0.5, 
      roughness: 0.5 
    });
    const cone = new THREE.Mesh(coneGeometry, coneMaterial);
    cone.position.set(20, 0, 0);
    cone.castShadow = true;
    cone.receiveShadow = true;
    scene.add(cone);

    // Ground plane
        const planeGeometry = new THREE.PlaneGeometry(500, 500);
        const planeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x404040, 
            transparent: true, 
            opacity: 0.3 
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -80;
        plane.receiveShadow = true;
        scene.add(plane);

    // thêm các lựa chọn khác
    const loader = new THREE.GLTFLoader();
    const loadingDiv = document.getElementById('loading');
    const modelURLs= {
      'duck': 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
            'robot': 'https://cdn.jsdelivr.net/gh/google/model-viewer@master/packages/shared-assets/models/RobotExpressive.glb',
            'car': 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMilkTruck/glTF-Binary/CesiumMilkTruck.glb',
            'quả bơ': 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb'
        };
    let currentModel = null;
    let interactiveObjects = [cube, sphere, cone];

    // Hàm tải mô hình
       function loadModel(modelName) {
        if (currentModel) {
                scene.remove(currentModel);
                // xóa đối tượng tương tác cũ
                interactiveObjects = interactiveObjects.filter(obj => 
                    obj === cube || obj === sphere || obj === cone
                );
                currentModel = null;
            }

            loadingDiv.style.display = 'block';
            loadingDiv.textContent = `Loading ${modelName} model...`;

            const modelUrl = modelURLs[modelName];
            
            loader.load(
                modelUrl,
                function (gltf) {
                    currentModel = gltf.scene;
                    
                    // tỷ lệ và lựa chọn vị trí cho từng mô hình
                    switch(modelName) {
                        case 'duck':
                            currentModel.scale.set(20, 20, 20);
                            currentModel.position.set(-80, -30, 1);
                            break;
                        case 'robot':
                            currentModel.scale.set(30, 30, 30);  
                            currentModel.position.set(-80, -50, 1);
                            break;
                        case 'car':
                            currentModel.scale.set(20, 20, 20);  
                            currentModel.position.set(-80, -45, 1);  
                            break;
                        case 'quả bơ':
                            currentModel.scale.set(700, 700, 700);  
                            currentModel.position.set(-80, -60, 0);  
                            break;
                    }

                   // Bật bóng đổ và thêm vào các đối tượng tương tác
                    currentModel.traverse(function (child) {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            interactiveObjects.push(child);
                        }
                    });

                    scene.add(currentModel);
                    loadingDiv.style.display = 'none';
                    console.log(`${modelName} loaded successfully!`);
                    console.log(`Model scale:`, currentModel.scale);
                    console.log(`Model position:`, currentModel.position);
                    console.log(`Model bounding box:`, new THREE.Box3().setFromObject(currentModel));
                },
                function (progress) {
                    if (progress.total > 0) {
                        const percent = Math.round((progress.loaded / progress.total) * 100);
                        loadingDiv.textContent = `Loading ${modelName}... ${percent}%`;
                    }
                },
                function (error) {
                    console.error(`Error loading ${modelName}:`, error);
                    loadingDiv.textContent = `Failed to load ${modelName} model 😢`;
                    setTimeout(() => {
                        loadingDiv.style.display = 'none';
                    }, 3000);
                }
            );
        }

    // Sự kiện khi chọn model từ dropdown
    document.getElementById('modelSelect').addEventListener('change', function () {
      const selected = this.value;
      loadModel(selected);
    });

    // Load mặc định
    loadModel('duck');

    // Tốc độ xoay
    let rotationSpeed = 0.01;
        let direction = 1;

    // Bắt sự kiện phím
    window.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowUp':
          rotationSpeed += 0.01;
          break;
        case 'ArrowDown':
          rotationSpeed = Math.max(0, rotationSpeed - 0.01);
          break;
        case 'r':
          cube.material.color.set(0xffffff);
          sphere.material.color.set(0x00ff00);
          cone.material.color.set(0xffff00);
          break;
        case 'g':
          cube.material.color.set(0xff69b4); 
          sphere.material.color.set(0xffa500);
          cone.material.color.set(0xffffff);
          break;
        case 'b':
          cube.material.color.set(0xff0000); 
          sphere.material.color.set(0x808080);
          cone.material.color.set(0xFFD700);
          break;
        case 'y':
          cube.material.color.set(0x8B4513);
          sphere.material.color.set(0x00ff00);
          cone.material.color.set(0xff69b4);
          break;
        case 'd': // Phím d để làm đối tượng nhảy
          if (currentModel) {
            currentModel.position.y += 20;
            setTimeout(() => {
              if (currentModel) currentModel.position.y -= 20;
            }, 500);
          }
          break;
      }
    });

    // Thay đổi màu vật thể khi nhấn chuột (cải thiện để work với Duck)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.addEventListener('click', (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true); // recursive = true

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        if (clickedObject.material && clickedObject.material.color) {
          const randomColor = Math.random() * 0xffffff;
          clickedObject.material.color.set(randomColor);
          console.log('Clicked object color changed! 🎨');
        }
      }
    });

    // Giao diện đổi màu với dat.GUI
        const gui = new dat.GUI();
        
        const colors = {
            cubeColor: '#ff0000',
            sphereColor: '#0000ff',
            coneColor: '#ffff00',
            backgroundColor: '#111111'
        };

        const guiControls = {
            rotationSpeed: rotationSpeed,
            autoMove: true,
            modelJump: function() {
                if (currentModel) {
                    const originalY = currentModel.position.y;
                    currentModel.position.y += 30;
                    setTimeout(() => {
                        if (currentModel) currentModel.position.y = originalY;
                    }, 500);
                }
            },
            resetColors: function() {
                cube.material.color.set(0xff0000);
                sphere.material.color.set(0x0000ff);
                cone.material.color.set(0xffff00);

                // update gui colors
                colors.cubeColor = '#ff0000';
                colors.sphereColor = '#0000ff';
                colors.coneColor = '#ffff00';
                gui.updateDisplay();
            }
        };

        // GUI folders
        const colorFolder = gui.addFolder('Colors');
        colorFolder.addColor(colors, 'cubeColor').name('Cube').onChange((value) => {
            cube.material.color.set(value);
        });
        colorFolder.addColor(colors, 'sphereColor').name('Sphere').onChange((value) => {
            sphere.material.color.set(value);
        });
        colorFolder.addColor(colors, 'coneColor').name('Cone').onChange((value) => {
            cone.material.color.set(value);
        });
        colorFolder.addColor(colors, 'backgroundColor').name('Background').onChange((value) => {
            renderer.setClearColor(value);
        });

        const controlFolder = gui.addFolder('Controls');
        controlFolder.add(guiControls, 'rotationSpeed', 0, 0.1).name('Rotation Speed').onChange((value) => {
            rotationSpeed = value;
        });
        controlFolder.add(guiControls, 'autoMove').name('Auto Movement');
        controlFolder.add(guiControls, 'modelJump').name('Model Jump! 🚀');
        controlFolder.add(guiControls, 'resetColors').name('Reset Colors');

        colorFolder.open();
        controlFolder.open();

        // Xử lý resize
   window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

    // Vòng lặp animate
    function animate() {
      requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      // Xoay cube
      cube.rotation.x += rotationSpeed;
      cube.rotation.y += rotationSpeed;

      // Xoay sphere
      sphere.rotation.x += rotationSpeed;
      sphere.rotation.y += rotationSpeed;

      // Xoay cone
      cone.rotation.x += rotationSpeed;
      cone.rotation.y += rotationSpeed;

      // xoay mô hình hiện tại nếu đã load
            if (currentModel) {
                currentModel.rotation.y += rotationSpeed * 0.5;
            }
      // Tạo hiệu ứng lắc lư
      if (guiControls.autoMove) {
                cube.position.x = Math.sin(time) * 50;
                cube.position.y = Math.cos(time * 0.5) * 30;
                
                sphere.position.x = Math.cos(time * 0.8) * 40;
                sphere.position.z = Math.sin(time * 0.6) * 30;
                
                cone.position.y = Math.sin(time * 1.2) * 25;
                cone.position.z = Math.cos(time * 0.4) * 35;
       // hiệu ứng nổi mô hình
                if (currentModel) {
                    currentModel.position.x = Math.sin(time * 0.8) * 20 - 80;
                    currentModel.position.z = Math.cos(time * 0.6) * 15;
                }
            }
      

      // IMPORTANT: Update controls
      controls.update();
      renderer.render(scene, camera);
    }

    animate();