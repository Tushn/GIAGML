// Classe Tela
var Tela = function (id, fundo, nome){ 
// alterar fundo => loader, consulta do XML
	var _id = id, _nome = nome; // identificador da tela e o nome
	var _fundo = fundo; // url da imagem do fundo
	var _objetos = new Array();
	
	// Getters
	this.getFundo = function(){
		return _fundo;
	};
	this.getObj = function(id){
		return _objetos[id];
	};
	this.getNumObj = function(){
		return _objetos.length;
	};
	
	// Setters
	this.setFundo = function(fundo){
		_fundo = fundo;
	};
	this.setObj = function(objetos){
		var cont = _objetos.length;
		_objetos[cont] = objetos;
	};
	this.mostrarObj = function(){
		for(var i=0;i<_objetos.length;i++){
			// adicionar todos os objetos da tela
			_objetos[i].addObj();
			if(_objetos[i].getSubtipo()==2){
				// se o objeto for possivel de ser capturado deve ser passivel de tal
				_objetos[i].capturarObj();
			}else if(_objetos[i].getSubtipo()==3){
				// se o objeto for um ponto para mudar de mapa deve ser usado como referencia
				this.trocar(_objetos[i].getNome(),_objetos[i].getTeleporte());
			}
			_objetos[i].chamarEventos();
			_objetos[i].chamarListaEfeitos();
		};
		/* Para remover possíveis conversas não concluídas em telas anteriores */
		$("#face").remove();
		$(".saida").html("<div id=\"face\" style=\"width:96px; height:96px;\"> </div><div id=\"texto\"> </div>");
	};

	/*
		Inserir Objetos da tela
	*/
	this.mostrar = function(){
		// objeto com o endereco da imagem
		var fundo = new $.gameQuery.Animation({imageURL: "./imagens/background/"+_fundo});
		// adiciona a camada da imagem na tela
		$("#playground").playground().addGroup("fundo", {width: tela_width, height: tela_height})
						.addSprite("camada", {animation: fundo, width: tela_width, height: tela_height}).end();
		this.mostrarObj();
	};
	this.trocar = function(nome, id){
		$("#obj"+nome).click(function(){
			$("#playground").playground().clearScenegraph();
			id_tela_atual = id;
			tela[id].mostrar();
			cont_fala = 0;
		});
	};
};

function atualizarTela(){ // atualiza os objetos da tela atual
	$("#playground").playground().clearScenegraph();
	tela[id_tela_atual].mostrar();
}