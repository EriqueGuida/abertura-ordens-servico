package br.com.aberturaordensservico.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.com.aberturaordensservico.model.Equipamento;
import br.com.aberturaordensservico.repository.EquipamentoRepository;

@Service 
public class EquipamentoService {
    
    private final EquipamentoRepository equipamentoRepository;

    // Constructor
    public EquipamentoService(EquipamentoRepository equipamentoRepository) {
        this.equipamentoRepository = equipamentoRepository;
    }

    // Métodos do CRUD
    public Equipamento cadastrarEquipamento(Equipamento equipamento) {
        return equipamentoRepository.save(equipamento);
    }

    public List<Equipamento> listarEquipamentos() {
        return equipamentoRepository.findAll();
    }

    public Equipamento buscarEquipamentoPorId(Long id) {
        return equipamentoRepository.findById(id).orElse(null);
    }

    public Equipamento atualizarEquipamento(Long id, Equipamento equipamentoAtualizado) {
        Equipamento equipamentoExistente = equipamentoRepository.findById(id).orElse(null);
        if (equipamentoExistente != null) {
            equipamentoExistente.setNome(equipamentoAtualizado.getNome());
            return equipamentoRepository.save(equipamentoExistente);
        }
        return null;
    }

    public boolean deletarEquipamento(Long id) {
        if (equipamentoRepository.existsById(id)) {
            equipamentoRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public List<Equipamento> buscarEquipamentosPorSetorId(Integer setorId) {
        return equipamentoRepository.findBySetorId(setorId);
    }
}
