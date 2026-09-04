import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';

const colors = { bg: '#16110e', surface: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.09)', accent: '#e0895a', text1: '#f7f1ea', text2: 'rgba(247,241,234,0.56)' };
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function MonthPicker({ value, onChange }: { value: number | null; onChange: (m: number) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable style={styles.field} onPress={() => setOpen(true)}>
        <Text style={{ color: value ? colors.text1 : colors.text2 }}>
          {value ? MONTHS[value - 1] : 'Select month'}
        </Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            {MONTHS.map((label, i) => {
              const monthNum = i + 1;
              const selected = value === monthNum;
              return (
                <Pressable
                  key={label}
                  style={[styles.option, selected && { backgroundColor: colors.accent }]}
                  onPress={() => { onChange(monthNum); setOpen(false); }}
                >
                  <Text style={{ color: selected ? '#fff' : colors.text1 }}>{label}</Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  field: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 12 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 30 },
  sheet: { backgroundColor: colors.bg, borderRadius: 18, padding: 10, borderWidth: 1, borderColor: colors.border },
  option: { padding: 14, borderRadius: 12 },
});