class UserController {

    constructor(formId, tableId){

        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();

    } //fecha constructor

    onSubmit(){

        

        this.formEl.addEventListener("submit", event => {

            event.preventDefault();

            let values = this.getValues();

            values.photo = "";

            this.getPhoto().then(
                (content)=>{
                
                    values.photo = content;

                    this.addLine(values);

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

            fileReader.readAsDataURL(file);

        });
        //metodo que trata o arquivo para sucesso e fracasso

        
        
    }

    getValues(){

        let user = {};
        
        [...this.formEl.elements].forEach((field)=>{
            //usei os [] para declarar a coleção HTML formEl.elements como array, e o ... faz com que o código faça o spread das n posições que esse array pode conter

            if (field.name == 'gender' ){
    
                if (field.checked){
    
                    user[field.name] = field.value;
    
                }  
    
            } else {
        
                user[field.name] = field.value;
            }
        
        });
    
        return new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin);

        
    } //fecha getValues


    addLine(dataUser) {
    this.tableEl.innerHTML = `
    <tr>
        <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
        <td>${dataUser.name}</td>
        <td>${dataUser.email}</td>
        <td>${dataUser.admin}</td>
        <td>${dataUser.birth}</td>
        <td>
            <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
        </td>
  </tr>
  `;
    } //fecha metodo addLine

} //fecha class UserController