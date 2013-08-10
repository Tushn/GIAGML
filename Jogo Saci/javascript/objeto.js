/* Testes com POO para JS */

// Variaveis globais deste codigo
var num_objetos_inventario=0, obj_inventario_active=null, id_objeto_active=null;

// Classe Objeto
var Objeto = function (url, nome, tipo, subtipo, x, y, largura, altura){
	// variaveis da classe
	//var _url = url, _nome = nome, _tipo = tipo, _subtipo = subtipo, _x = x, _y = y, _largura = largura, _altura = altura, _teleporte, _imagem, _visivel = true, _efeitos = { tipo: new Array(), valor: new Array() };
	var _url = url, _nome = nome, _tipo = tipo, _subtipo = subtipo, _x = x*prop_width, _y = y*prop_height, _largura = largura, _altura = altura, _teleporte, _imagem, _visivel = true, _efeitos = { tipo: new Array(), valor: new Array() };
	if(x<0) _x = x/prop_width;
	if(y<0) _y = y/prop_height;
	var _eventos = new Array();
	var _contConversas=0, _conversaAtual = 0;
	
	/* Definição dos tipos:
		- tipo...
		1: figura comum, sem frame, só possui url, tamanho, largura e posicionamento
		2: animação, com frame, imagem de frames na Vertical
		3: animação, com frame, imagem de frames na Horizontal
		4: animação, com frame, imagem de frames na Vertical e Horizontal
	*/	
	
	/* Definição dos subtipos:
		1: Objeto que não pode ser capturado,
		2: Objeto que pode ser capturado e levado ao inventário,
		3: Ponto de navegação para mudar a tela
	*/

	// Getters (obtedores de variaveis da classe)
	this.getX = function(){
		return _x;
	};
	this.getY = function(){
		return _y;
	};
	this.getLargura = function(){
		return _largura;
	};
	this.getAltura = function(){
		return _altura;
	};
	this.getURL = function(){
		return _url;
	};
	this.getNome = function(){
		return _nome;
	};
	this.getTipo = function(){
		return _tipo;
	};
	this.getSubtipo = function(){
		return _subtipo;
	};
	this.getTeleporte = function(){
		return _teleporte;
	};
	this.getVisivel = function(){
		return _visivel;
	};
	this.getImagem = function(){
		return _imagem;
	};
	this.getId = function(){
		return "#obj"+_nome;
	};
	this.getUltimoEvento = function(){ 
		return _eventos[_eventos.length-1]; // retorna o ultimo evento da lista de eventos
	};
	this.getListaEventos = function(){
		return _eventos;
	};
	this.getEvento = function(n){ // retorna um 'n' evento escolhido
		return _eventos[n];
	};
	
	// Setters (inserir valores nas variaveis da classe)
	this.setImagem = function(imagem){
		_imagem = imagem;
	};
	this.setTeleporte = function(id){
		_teleporte = id;
	};
	this.setVisivel = function(valor){
		if(valor=="true" || valor==true){
			_visivel = true;
		}else if(valor=="false" || valor==false){
			_visivel = false;
		}
	};

	/**
		Conversas e discursões
	*/
	this.addConversaAtual = function(){
		_conversaAtual++;
	}
	this.getConversaAtual = function(){
		return _conversaAtual;
	}
	/**
		Eventos 
	*/
	//chamados por meio do click
	this.chamarEventos = function(){
		if (_visivel){
			for(var i=0; i<_eventos.length; i++){
				_eventos[i].acao();
			}
		}
	}
	//adicionados
	this.setEvento = function(tipo, condicao, idTela, idObj){
		_eventos[_eventos.length] = new Evento(tipo, condicao, idTela, idObj);
		if(tipo=="fala") _contConversas++;
	}
	
	/**
		Abaixo, funcoes de manipulacao do estado na tela (inserir/capturar)
	*/
	// inserir objeto na tela
	this.addObj = function(){
		if(!_visivel)
		for(var i=0;i<_eventos.length;i++)
			if(_eventos[i].getTipo()=="liberar_objeto"){
				_eventos[i].acao();
			}
		if(_visivel){
			_imagem = new $.gameQuery.Animation({imageURL:"./imagens/objetos/"+_url});
			$.playground().addSprite("obj"+_nome, {animation: _imagem, posx: _x, posy: _y, width: _largura, height: _altura }).end();
			$("#obj"+_nome).attr("nome",_nome);
		}
	};
	
	// capturarObj, pega um objeto da tela e leva-o para o inventario da tela
	this.capturarObj = function(){
		// Fazer objeto desaparecer da tela lentamente
		$("#obj"+_nome).click(function(){
			if(_visivel){ // verifica se o objeto ja recebeu o comando para ficar invisivel [corrigi BUG do inventario com o click duplo]
				_visivel = false;
				$(this).fadeOut("slow");
			
				num_objetos_inventario = num_objetos_inventario + 1;
			
				// Faz aparecer no inventário da tela
				var item = "<dl id=\"item"+num_objetos_inventario+"\"><img id=\"obj"+num_objetos_inventario+"\" src=\""+_imagem.imageURL+"\""+"class=\"itens_lista\""+"objeto=\""+_nome+"\"/>";
			
				//$("#item"+(num_objetos_inventario-1)).after(item);
				$("#item"+0).after(item); // corrige erro dos objetos do inventário
				$("#item"+num_objetos_inventario).click(function(){ // utilizar objeto do inventario
					var id = $(this).attr("id"), idnova = new Array;
					// abaixo o loop retira da string "#objN" o valor N
					for(var i=0; i < id.length-4; i++){
						idnova[i]=id[i+4];
					}
					
					id_objeto_active = idnova; // a variavel, id_objeto_active, e global
					var url = $("#obj"+idnova).attr("objeto");
					url = "imagens/objetos/itens/"+url+".png";
					// se ele clicou no mesmo objeto que manipulava, entao o mouse retorna ao normal
					if(obj_inventario_active == $("#obj"+idnova).attr("objeto")){
						$("body").css("cursor","default"); // alterar cursor para o desenho normal
						obj_inventario_active="NULL"; // bloquear valor da variavel
						$("dl").css("background-color","");
					}else{
						$("body").css("cursor","url(\""+url+"\"),url(\""+url+"\"), auto"); // alterar cursor para o desenho do objeto
						obj_inventario_active=$("#obj"+idnova).attr("objeto"); // usar variavel
						$("dl").css("background-color","");
						$("#item"+idnova).css("background-color","#6ac");
					};
				});
			};
		});
	};
	
	/** 
		Abaixo os efeitos das classes 
	*/
	// adicionar efeito
	this.addEfeito = function(tipo, valor){
		_efeitos.tipo[_efeitos.tipo.length] = tipo; // o array armazena varios efeitos
		_efeitos.valor[_efeitos.valor.length] = valor;
	};
	
	// Metodo que possui todos os efeitos, a priori, da classe [Como tamanho, rotacionar, etc]. Defina o tipo na entrada
	this.acionarEfeito = function(tipo, valor){
		switch(tipo){
			case "scale": // alterar tamanho da figura
				$("#obj"+_nome).scale(valor); // valor: 1 = tamanho normal, 0.5 = metade do tamanho, 2.0 = duas vezes o tamanho original
				break
			case "rotate": // rotacionar figura em sentido horario
				$("#obj"+_nome).rotate(valor); // valor: dado em graus (de 0 a 360). Rotacao no sentido horario
				break
			case "flipv": // inversao vertical da figura
				$("#obj"+_nome).flipv(valor); // valor: true ou false (ou ainda 1 ou 0), para definir o flip
				break
			case "fliph": // inversao horizontal da figura
				$("#obj"+_nome).fliph(valor); // valor: true ou false (ou ainda 1 ou 0), para definir o flip
				break
			case "visivel":
				if(valor=="true"){ 
					this.setVisivel(true);
				}else{
					this.setVisivel(false);
					$("#obj"+_nome).remove();
				}
				break
		}
	};
	
	// Chamar lista de efeitos
	this.chamarListaEfeitos = function(){
		if(this.getVisivel()) // efetuar procedimentos apenas se o objeto estiver visivel na tela
		for(var i=0; i< _efeitos.tipo.length; i++){
			this.acionarEfeito(_efeitos.tipo[i], _efeitos.valor[i]);
		}
	}
	
	// Chamar efeito escolhido na lista de efeitos do objeto
	this.chamarEfeito=function(id){
		if(_visivel)
			this.acionarEfeito(_efeitos.tipo[id], _efeitos.valor[id]);
	}
	

};

// Objetos com desenhos em animacoes horizontais
var ObjetoHorA = function(url, nome, tipo, subtipo, x, y, largura, altura, delta, numFrame, rate){
	Objeto.call(this,url, nome, tipo, subtipo, x, y, largura, altura);
	var _delta = delta, _numFrame = numFrame, _rate = rate;

	this.addObj_semAnimacao = this.addObj;

	this.addObj = function(){
		if(!this.getVisivel())
			for(var i=0;i<this.getListaEventos().length;i++)
				if(this.getEvento(i).getTipo()=="liberar_objeto")
					this.getEvento(i).acao();
		if(this.getVisivel()){
			this.setImagem(new $.gameQuery.Animation({imageURL:"./imagens/animacoes/"+ this.getURL(), delta: _delta, numberOfFrame: _numFrame, rate: _rate, type: $.gQ.ANIMATION_HORIZONTAL}));
			$.playground().addSprite("obj"+this.getNome(), {animation: this.getImagem(), posx: this.getX(), posy: this.getY(), width: this.getLargura(), height: this.getAltura()}).end();
		}
	};
};


// Objetos com desenhos em animacoes verticais
var ObjetoVerA = function(url, nome, tipo, subtipo, x, y, largura, altura, delta, numFrame, rate){
	Objeto.call(this,url, nome, tipo, subtipo, x, y, largura, altura);
	var _delta = delta, _numFrame = numFrame, _rate = rate;

	this.addObj_semAnimacao = this.addObj;

	this.addObj = function(){
		if(!this.getVisivel())
			for(var i=0;i<this.getListaEventos.length;i++)
				if(this.getEvento(i)[i].getTipo()=="liberar_objeto")
					this.getEvento(i)[i].acao();
		if(this.getVisivel()){
			this.setImagem(new $.gameQuery.Animation({imageURL:"./imagens/animacoes/"+ this.getURL(), delta: _delta, numberOfFrame: _numFrame, rate: _rate, type: $.gQ.ANIMATION_VERTICAL}));
			$.playground().addSprite("obj"+this.getNome(), {animation: this.getImagem(), posx: this.getX(), posy: this.getY(), width: this.getLargura(), height: this.getAltura()}).end();
		}
	};
};


// Objetos com desenhos verticais parados
var ObjetoVerP = function(url, nome, tipo, subtipo, x, y, largura, altura, delta, numFrame, rate, distance){
	Objeto.call(this,url, nome, tipo, subtipo, x, y, largura, altura);
	var _delta = delta, _numFrame = numFrame, _rate = rate, _distance = distance;

	this.addObj_semAnimacao = this.addObj;

	this.addObj = function(){
		if(!this.getVisivel())
			for(var i=0;i<this.getListaEventos.length;i++)
				if(this.getEvento(i).getTipo()=="liberar_objeto")
					this.getEvento(i).acao();
		if(this.getVisivel()){
			this.setImagem(new $.gameQuery.Animation({imageURL:"./imagens/animacoes/"+ this.getURL(), delta: _delta, numberOfFrame: _numFrame, distance: _distance, rate: _rate, type: $.gQ.ANIMATION_VERTICAL | $.gQ.ANIMATION_MULTI}));
			$.playground().addSprite("obj"+this.getNome(), {animation: this.getImagem(), posx: this.getX(), posy: this.getY(), width: this.getLargura(), height: this.getAltura()}).end();
		}
	};
};