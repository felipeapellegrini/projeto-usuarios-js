class UserController {

    constructor(formId, tableId){

        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();

    } //fecha constructor

    onSubmit(){

        

        this.formEl.addEventListener("submit", event => {

            event.preventDefault();

            let btn = this.formEl.querySelector('[type=submit]');

            btn.disabled = true;

            let values = this.getValues();
            
            if (!values) return false; //trata exceção de gravar foto no vazio caso o usuario de regaço no elements

            this.getPhoto().then(
                (content)=>{
                
                    values.photo = content;

                    this.addLine(values);

                    this.formEl.reset();

                    btn.disabled = false;

                }, 
                (e)=>{

                    console.error(e);

                }
            );
            //função que recebe o conteúdo da foto em base64 e depois de carregada, adiciona linha na tabela HTML em caso de sucesso ou retorna o erro quando fracasso.
            
        });


    } //fecha onSubmit

    getPhoto(){

        return new Promise((resolve, reject)=>{

            let fileReader = new FileReader();

            let elements = [...this.formEl.elements].filter(item=>{

                if (item.name === 'photo') {
                    return item;
                }
            });
             //retorna apenas o elemento filtrado (photo) do formulario

            let file = elements[0].files[0];
            //armazena na variavel file o primeiro arquivo da coleção elements

            fileReader.onload = ()=>{

                resolve(fileReader.result);
            };
            //metodo que invoca a função de resolve para quando terminar a leitura do arquivo com sucesso

            fileReader.onerror = (e) => {

                reject(e);

            };
            //metodo que invoca a função reject para quando der falha na leitura do arquivo (tamanho, extensão...)

            if (file){

                fileReader.readAsDataURL(file);

            } else{
                resolve('dist/img/boxed-bg.jpg');
            }
            //se o usuario não enviar fotos, trate o arquivo sem foto.

        });
        //metodo que trata o arquivo para sucesso e fracasso

        
        
    }

    getValues(){

        let user = {};
        let isValid = true;
        
        
        [...this.formEl.elements].forEach((field)=>{
            //usei os [] para declarar a coleção HTML formEl.elements como array, e o ... faz com que o código faça o spread das n posições que esse array pode conter

            if (['name', 'birth', 'email', 'password'].indexOf(field.name) > -1 && !field.value){

                field.parentElement.classList.add('has-error');
                isValid = false;

            } //valida se os campos obrigatórios estão preenchidos

            if (field.name == 'gender' ){
    
                if (field.checked){
    
                    user[field.name] = field.value;
    
                }  //valida se algum dos generos está marcado e armazena o valor selecionado
    
            } else if (field.name == 'admin'){

                user[field.name] = field.checked;


            }  else { //valida se o usuario é administrador
        
                user[field.name] = field.value;
            }
        
        });

        if (!isValid){

            return false;
            
        }//valida se o formulário é válido e quebra se não for
    
        return new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin);

        
    } //fecha getValues


    addLine(dataUser) {

        let tr = document.createElement('tr');
        //cria variavel para criar novos elementos tr no HTML
               
        tr.dataset.user = JSON.stringify(dataUser); //convertendo o elemento em uma string JSON para não perder o conteúdo
        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Sim' : 'Não'/* avalia a resposta do admin e converte em sim/não */}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
    `;
    //comando HTML que adiciona as informações do formulario à tabela do site

    this.tableEl.appendChild(tr);
    //metodo que appenda a tabela criada à tabela do site

    this.updateCount();


    } //fecha metodo addLine

    updateCount(){

        let numberUsers = 0;
        let numberAdmins = 0;

        [...this.tableEl.children].forEach(tr=>{

            numberUsers++;

            let user = JSON.parse(tr.dataset.user); //convertendo o elemento string JSON para objeto

            if (user._admin) numberAdmins++;

        }); //atualizando as contagens de admin e usuário simples

        document.querySelector('#number-users').innerHTML = numberUsers; //atualiza número de usuários
        document.querySelector('#number-admins').innerHTML = numberAdmins; //atualiza número de administradores

    }

} //fecha class UserController