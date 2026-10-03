package br.com.aberturaordensservico.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.aberturaordensservico.model.Equipamento;

public interface EquipamentoRepository  extends JpaRepository<Equipamento, Long> {
    
}
