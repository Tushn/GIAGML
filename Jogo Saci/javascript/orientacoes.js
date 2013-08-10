var cont_fala = 0;
var Evento = function(tipo, tipo_condicao, idTela, idObj){
	// variaveis, lista das condicoes, tipos de eventos, endereco das telas e dos objetos
	var _condicao = new Array(), _tipo = tipo, _idTela = idTela, _idObj = idObj, _efeitos = {tipo: new Array(), valor: new Array()};		
	_condicao[_condicao.length] = new Condicao(tipo_condicao);// adicionar um tipo de condicao
	var _chave = new Array();
	var _duracao = "instantaneo";// variaveis da ultima atualizacao, padrao = "instantaneo", outro tipo: "permanente"
	var _itens = new Array(),_falas = new Array(); // lista de itens que podem ser obtidos ou inseridos no inventario// lista com as falas do personagem
	var _objID=null, _telaID=null;// variaveis de manipular outros objetos
	
	// Getters
	this.getTipo = function(){
		return _tipo;
	};
	this.getIdTela = function(){
		return _idTela;
	};
	this.getCondicao = function(){
		return _condicao[0];
	};
	this.getTipoCondicao = function(){
		return _condicao[0].getTipo();
	};
	
	// Setters
	this.setCondicao = function(nome){
		_condicao[_condicao.length-1].setCondicao(nome);
	}
	this.setDuracao = function(duracao){ // dois tipos de duracao: "instantaneo" [padrao] e o "permanente"
		_duracao = duracao;
	}
	this.setItem = function(url, nome){
		_itens[_itens.length] = new Item(url, nome);
	}
	this.setFala = function(texto, tipo, id, nome, url){
		_falas[_falas.length] = new Fala(texto, tipo, id, nome, url);
	}
	this.setEstado = function(estado){
		_condicao[_condicao.length-1].setEstado(estado);
	}
	this.setChave = function(chave){
		for(var i=0; i<chave.length; i++){
			_chave[_chave.length] = chave[i];
		}
	}
	this.setObjID = function(valor){
		_objID=valor;
	}
	this.setTelaID = function(valor){
		_telaID=valor;
	}

	// EFEITOS , estrutura no momento mas releva-lo como uma possivel classe posteriormente
	this.addEfeito = function(tipo, valor){
		_efeitos.tipo[_efeitos.tipo.length] = tipo;
		_efeitos.valor[_efeitos.valor.length] = valor;
	}
	
	// metodo que chama o evento desejado
	this.acao = function(){ // quando uma condicao for verdadeira entao deve realizar uma acao
		for(var i=0;i<_condicao.length;i++){
			if(_condicao[i].getEstado())
			switch(_tipo){
				case "efeito": // define para efeitos
					switch(_condicao[i].getTipo()){
						case "1": // sem condicoes
							//for(var i=0;i<_efeitos.tipo.length;i++){
							for(var j = 0; j<_efeitos.tipo.length;j++)
								if(_condicao[i].testar()){
									tela[_idTela].getObj(_idObj).acionarEfeito(_efeitos.tipo[j], _efeitos.valor[j]);
								};
							//}	
						break
						case "5": // ocorrera se um evento chave ja estiver liberado
							for(var j=0;j<chaves.length;j++)
								if(_condicao[0].getSenha()==chaves[j]){
									for(var j = 0; j<_efeitos.tipo.length;j++)
										tela[_idTela].getObj(_idObj).acionarEfeito(_efeitos.tipo[j], _efeitos.valor[j]);
								}
							//if(id_tela_atual == _idTela) tela[_idTela].mostrar(); // caso esteja na tela corrente atualize-a
							break
						}
					break
				case "receber": // o jogador recebera um item do jogo que ira para o seu inventario
					switch(_condicao[i].getTipo()){
						case "1": // liberado
							for(var j = 0; j<_itens.length;j++){
								_itens[j].addInventario();
								_itens[j].setIlimitado();
							}
							break
						case "5": // ocorrera se um evento chave ja estiver liberado
							for(var j=0;j<chaves.length;j++)
								if(_condicao[0].getSenha()==chaves[j]){
									for(var j = 0; j<_itens.length;j++){
										_itens[j].addInventario();
										_itens[j].setIlimitado();
									}
								}	
						break
							
					}
					break
				case "liberar_chave":
					switch(_condicao[i].getTipo()){
						case "1": // liberado
							for(var j=0;j<_chave.length;j++){
								for(var j2=0; j2<chaves.length; j2++){
									if(chaves[j2]==_chave[j]){
										j2=0;j++;
									}else if(j2==(new Number(chaves.length)-1)){
										chaves[chaves.length] = _chave[j];
									}
								}
								if(chaves.length=="0"){
									chaves[chaves.length] = _chave[0];
								}
							}
							atualizarTela();
							break
						case "5": // se chave ja estiver liberada evento devera ocorrer
							for(var j=0;j<chaves.length;j++)
								if(_condicao[0].getSenha()==chaves[j]){
									for(var j1=0;j1<_chave.length;j1++){
										for(var j2=0; j2<chaves.length; j2++){
											if(chaves[j2]==_chave[j1]){
												j2=0;j1++;
											}else if(j2==(new Number(chaves.length)-1)){
												chaves[chaves.length] = _chave[j1];
											}
										}
										if(chaves.length=="0"){
											chaves[chaves.length] = _chave[0];
										}
									}
								}
							atualizarTela();
							break
					};
					break
				case "fala":
					//alert(_falas[0].falar());
					switch(_condicao[i].getTipo()){
						case "1": // liberado
							break
						case "5":
							$("#obj"+tela[_idTela].getObj(_idObj).getNome()).click(function(){
						alert("sasas");//		if(false)
								for(var j=0;j<chaves.length;j++){
									if(_condicao[0].getSenha()==chaves[j])										
											//for(var j = 0; j<_falas.length;j++){
										if(cont_fala==_falas.length){ 
											$("#face").remove();
											$(".saida").html("<div id=\"face\" style=\"width:96px; height:96px;\"> </div><div id=\"texto\"> </div>");
											cont_fala = 0;
										}else{
											_falas[cont_fala].falar();
											cont_fala++;
										}
								}
							});
							break
					}
					break
				case "liberar_objeto": // se um objeto estiver invisível este evento passa a libera-lo
					case "5":
						for(var cont_chaves=0; cont_chaves<chaves.length;cont_chaves++)
							if(_condicao[0].getSenha()==chaves[cont_chaves]){
								tela[_telaID].getObj(_objID).setVisivel("true");
								_condicao[i].setEstado(false)
							}
					break
				}
		};
		$("#obj"+tela[_idTela].getObj(_idObj).getNome()).click(function(){
			for(var i=0;i<_condicao.length;i++){
				if(_condicao[i].getEstado())
					switch(_tipo){
						case "efeito": // define para efeitos
							switch(_condicao[i].getTipo()){
								case "2": // simplesmente ao clicar
									for(var j = 0; j<_efeitos.tipo.length;j++){
										tela[_idTela].getObj(_idObj).acionarEfeito(_efeitos.tipo[j], new Number(_efeitos.valor[j]));
										if(_duracao=="permanente"){
											tela[_idTela].getObj(_idObj).addEfeito(_efeitos.tipo[j], new Number(_efeitos.valor[j]));
										}
										}
									break
								case "3": // obter efeito por meio de objeto
										if(_condicao[0].getSenha() == obj_inventario_active){
											tela[_idTela].getObj(_idObj).acionarEfeito(_efeitos.tipo[j], new Number(_efeitos.valor[j]));
										}
									break
								case "4": // obter efeito por meio de evento chave
										if(_condicao[0].getSenha() == obj_inventario_active){
											for(var j = 0; j<_efeitos.tipo.length;j++){
												tela[_idTela].getObj(_idObj).acionarEfeito(_efeitos.tipo[j], new Number(_efeitos.valor[j]));
												if(_duracao=="permanente")
													tela[_idTela].getObj(_idObj).addEfeito(_efeitos.tipo[j], new Number(_efeitos.valor[j]));
											}
											removerItem();
											//$("#"+$("[objeto='"+obj_inventario_active+"']").attr("id")).remove();
											
										}
									break
							}
							break
						case "receber": // o jogador recebera um item do jogo que ira para o seu inventario
							switch(_condicao[i].getTipo()){
								case "2": // simplesmente ao clicar								
									for(var j = 0; j<_itens.length;j++){
										_itens[j].addInventario();
										if(_duracao!="permanente"){
											_itens[j].setIlimitado();
										}
									}
									break
								case "3": // usar item
									if(_condicao[0].getSenha() == obj_inventario_active){
										for(var j = 0; j<_itens.length;j++){
											_itens[j].addInventario();
											if(_duracao!="permanente"){
												_itens[j].setIlimitado();
											}
										}
									}
									break
								case "4": // obter efeito por meio de item consumido
									if(_condicao[0].getSenha() == obj_inventario_active){
										for(var j = 0; j<_itens.length;j++){
											_itens[j].addInventario();
											if(_duracao!="permanente"){
												_itens[j].setIlimitado();
											}
										}
										removerItem();
									}
									break
							}
							break
						case "liberar_chave": // o jogo carrega uma condição global como verdadeira
							switch(_condicao[i].getTipo()){
								case "2": // ao clicar
									for(var j=0;j<_chave.length;j++){
										for(var j2=0; j2<chaves.length; j2++){
											if(chaves[j2]==_chave[j]){
												j2=0;j++;
											}else if(j2==(new Number(chaves.length)-1)){
												chaves[chaves.length] = _chave[j];
											}
										}
										if(chaves.length=="0"){
											chaves[chaves.length] = _chave[0];
										}
									}
									atualizarTela();
								break
								case "3": // clicar com item
									if(_condicao[0].getSenha() == obj_inventario_active){
										for(var j=0;j<_chave.length;j++){
											for(var j2=0; j2<chaves.length; j2++){
												if(chaves[j2]==_chave[j]){
													j2=0;j++;
												}else if(j2==(new Number(chaves.length)-1)){
													chaves[chaves.length] = _chave[j];
												}
											}
											if(chaves.length=="0"){
												chaves[chaves.length] = _chave[0];
											}
										}
									}
									atualizarTela();
								break
								case "4": // item consumido
									if(_condicao[0].getSenha() == obj_inventario_active){
										for(var j=0;j<_chave.length;j++){
											for(var j2=0; j2<chaves.length; j2++){
												if(chaves[j2]==_chave[j]){
													j2=0;j++;
												}else if(j2==(new Number(chaves.length)-1)){
													chaves[chaves.length] = _chave[j];
												}if(j>=_chave.length)break;
											}
											if(chaves.length=="0"){
												chaves[chaves.length] = _chave[0];
											}
										}
										removerItem();
										//alert("Chave.length"+_chave.length+"\nChaves.length: "+chaves.length+"\nJ: "+j+"\nJ2: "+j2);
									}
									atualizarTela();
									break
								};
						break
						case "fala": // diálogos do jogador
							switch(_condicao[i].getTipo()){
								case "2": // simplesmente ao clicar
									if(cont_fala==_falas.length){ 
										$("#face").remove();
										$(".saida").html("<div id=\"face\" style=\"width:96px; height:96px;\"> </div><div id=\"texto\"> </div>");
										cont_fala = 0;
									}else{
										_falas[cont_fala].falar();
										cont_fala++;
									}
									if(_duracao!="permanente"){
										this.tela[id_tela_atual].getObj(_idObj).addConversaAtual();
									}
									break
								case "3": // item nao consumido
									if(_condicao[0].getSenha() == obj_inventario_active){
										if(cont_fala==_falas.length){
											$("#face").remove();
											$(".saida").html("<div id=\"face\" style=\"width:96px; height:96px;\"> </div><div id=\"texto\"> </div>");
											if(_duracao!="permanente"){ // caso o evento seja permanente a frase so devera aparecer uma vez
												cont_fala = 0;
											}
										}else{ // caso o evento seja instantaneo ele devera ocorrer varias vezes
											_falas[cont_fala].falar();
											cont_fala++;
										}
									}
									break
								case "4":
									if(_condicao[0].getSenha() == obj_inventario_active){
										if(cont_fala==_falas.length){
											$("#face").remove();
											$(".saida").html("<div id=\"face\" style=\"width:96px; height:96px;\"> </div><div id=\"texto\"> </div>");
											removerItem();
											cont_fala = 0;
											obj_inventario_active = null;
										}else{
											_falas[cont_fala].falar();
											cont_fala++;
										};
									}
									break
							}
							break
					}
			}
		});
		
	};
}

/* funcao auxiliar para limpar dados e imagens de itens removidos do inventario
 nao pode ser colocado dentro da classe para ser chamada nos eventos de click */
function removerItem(){
	$("#item"+id_objeto_active).remove();
	$("body").css("cursor","default");
	if(id_objeto_active==num_objetos_inventario)
		num_objetos_inventario--;
};

var Item = function(url, nome){
	var _url = "imagens/objetos/itens/"+url, _nome = nome, _limite = 1, _ilimitado = false;
	
	this.getURL = function(){
		return _url;
	}
	this.getNome = function(){
		return _nome;
	}
	this.setIlimitado = function(){
		_ilimitado = true;
	}
	
	this.addInventario = function(){
		if(_limite>0 || _ilimitado){
			_limite--;
			num_objetos_inventario = num_objetos_inventario + 1;
			// Faz aparecer no inventário da tela
			var item = "<dl id=\"item"+num_objetos_inventario+"\"><img id=\"obj"+num_objetos_inventario+"\" src=\""+_url+"\""+"class=\"itens_lista\""+"objeto=\""+_nome+"\"/>";
				
			$("#item"+(num_objetos_inventario-1)).after(item);
			$("#item"+num_objetos_inventario).click(function(){ // utilizar objeto do inventario
				var id = $(this).attr("id"), idnova = new Array;
				// abaixo o loop retira da string "#objN" o valor N
				for(var i=0; i < id.length-4; i++){
					idnova[i]=id[i+4];
				}
				id_objeto_active=idnova;
				// se ele clicou no mesmo objeto que manipulava, entao o mouse retorna ao normal
				if(obj_inventario_active == $("#obj"+idnova).attr("objeto")){
					$("body").css("cursor","default"); // alterar cursor para o desenho normal
					obj_inventario_active="NULL"; // bloquear valor da variavel
					$("dl").css("background-color","");
				}else{
					$("body").css("cursor","url(\""+_url+"\"),url(\""+_url+"\"), auto"); // alterar cursor para o desenho do objeto
					obj_inventario_active=$("#obj"+idnova).attr("objeto"); // usar variavel
					$("dl").css("background-color","");
					$("#item"+idnova).css("background-color","#6ac");
				};
			});
		}
	}
}

var Fala = function(texto, tipo, id, nome, url){
	var _texto = texto, _tipo = tipo, _estado = null, _senha = null, _rosto = new Rosto(id, nome, url);
	
	// Setters 
	this.setTexto = function(texto){
		_texto = texto;
	}
	this.setSenha = function(senha){
		_senha = senha;
	}
	
	// Getters
	this.getTexto = function(){
		return _texto;
	}
	
	// mostrar rosto e face
	this.falar = function(){
		_rosto.mostrar();
		$("#texto").html(_texto);
	}
};

var Rosto = function(id, nome, url){
	var  _id = id, _nome = nome, _url = url;
	var _pontosCorte = "";
	
	// coloca imagem na tela
	this.mostrar = function(){
		var num;
		$("#face").css("background-image","url(\"imagens/FacesVX/"+_url+"\")");
		if(_id<4){
			num = -(_id*96);
			_pontosCorte = num+"px "+" 0px";
		}else{
			num = -((_id-4)*96);
			_pontosCorte = num+"px "+" 96px";
		}
		$("#face").css("background-position",_pontosCorte);
	}
	
	// mudar imagem
	this.mudar = function(id){
		_id = id;
	}
};

var Condicao = function(tipo){
/** Tipos de condicoes */
/*
	(Tipo)
		1: nenhuma (ativada ao iniciar)
		2: ao clicar (sem nenhuma especificacao)
		3: ao usar item do inventario // uso da variavel [senha], para armazenar o valor da condicao
		4: ao usar o item do inventario e ele ser consumido no seu uso
		5: ao desbloquear evento por meio de outra acao
*/
	var _tipo = tipo, _senha=new Array(), _nome, _estado = true;
	//var _condicoes = new Array();
	
	// Getters da classe Condicao
	this.getTipo = function(){
		return _tipo;
	};
	this.getSenha = function(){
		return _senha;
	};
	this.getNome = function(){
		return _nome;
	};
	this.getEstado = function(){
		return _estado;
	};
	
	// Setters da classe Condicao
	this.setSenha = function(senha){
		_senha[_senha.length] = senha;
	};
	this.setCondicao = function(nome){
		_nome = nome;
	};
	this.setEstado = function(estado){
		_estado = estado;
	};
	
	// testar se a condicao foi ou nao usada
	this.testar = function(){
		var teste = false;
		switch(_tipo){
			case "1": // condicao, nao existe restricao
				return true;
				break
			case "2": // condicao de clicar em um determinado objeto			
				$("#obj"+_nome).click(function(){
					teste = true;alert("hurra");
					return true;
				});
				break
			case "3":
				$("#obj"+_nome)(function(){
					if(obj_inventario_active==_senha) return true; //acao(); // uso da [SENHA]
				});
				break
			case "4":
				for(var i=0; i<chaves.length; i++){
					if(chaves[i]==_senha){
						return true;
					}
				}
				break
			default:
				return false;
				break
		};
		if(teste){
			return true;
		}
		return false;
	};	
}
